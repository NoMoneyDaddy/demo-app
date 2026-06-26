#!/usr/bin/env bash
set -euo pipefail

MODE="plan"
WORKSPACE=""
FORCE="0"
EXPORT_GLOBAL="0"

usage() {
  cat <<'EOF'
用法:
  bash scripts/export_skills_for_hermes_openclaw.sh --plan
  bash scripts/export_skills_for_hermes_openclaw.sh --global
  bash scripts/export_skills_for_hermes_openclaw.sh --workspace ../other-project
  bash scripts/export_skills_for_hermes_openclaw.sh --global --workspace ../other-project --force

說明:
  --plan        顯示會匯出到哪裡
  --global      匯出到 ~/.agents/skills 與 ~/.hermes/skills
  --workspace   匯出到指定 workspace 的 .agents/skills 與 skills
  --force       已存在時覆蓋 SKILL.md
EOF
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_ROOT="$REPO_ROOT/.agents/skills"

if [[ ! -d "$SOURCE_ROOT" ]]; then
  echo "❌ 找不到來源 skills: $SOURCE_ROOT"
  exit 1
fi

skill_count() {
  find "$SOURCE_ROOT" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' '
}

copy_skill_dir() {
  local target_root="$1"
  local source_dir
  local skill_name

  mkdir -p "$target_root"

  for source_dir in "$SOURCE_ROOT"/*; do
    [[ -d "$source_dir" ]] || continue
    skill_name="$(basename "$source_dir")"

    local target_dir="$target_root/$skill_name"
    local target_skill="$target_dir/SKILL.md"

    if [[ -e "$target_skill" && "$FORCE" != "1" ]]; then
      echo "⏭️ 跳過既有 skill: $target_skill"
      continue
    fi

    mkdir -p "$target_dir"
    cp -R "$source_dir"/. "$target_dir"/
    echo "✅ 已匯出: $target_dir"
  done
}

print_plan() {
  cat <<EOF
來源:
  $SOURCE_ROOT

技能數量:
  $(skill_count)

全域目標:
  ~/.agents/skills
  ~/.hermes/skills

workspace 目標:
  <workspace>/.agents/skills
  <workspace>/skills

說明:
  - OpenClaw 幾乎可直接使用 workspace 的 \`.agents/skills\` 與 \`skills\`
  - Hermes 建議另外匯出到 \`~/.hermes/skills\`
  - 本 repo 的所有 SKILL.md 已有 YAML frontmatter
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --plan)
      MODE="plan"
      ;;
    --global)
      MODE="export"
      EXPORT_GLOBAL="1"
      ;;
    --workspace)
      MODE="export"
      WORKSPACE="${2:-}"
      shift
      ;;
    --force)
      FORCE="1"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "❌ 未知參數: $1"
      usage
      exit 1
      ;;
  esac
  shift
done

if [[ "$MODE" == "plan" ]]; then
  print_plan
  exit 0
fi

if [[ "$EXPORT_GLOBAL" == "1" ]]; then
  echo "開始匯出全域 skills..."
  copy_skill_dir "$HOME/.agents/skills"
  copy_skill_dir "$HOME/.hermes/skills"
fi

if [[ -n "$WORKSPACE" ]]; then
  mkdir -p "$(dirname "$WORKSPACE")"
  WORKSPACE="$(cd "$(dirname "$WORKSPACE")" && pwd)/$(basename "$WORKSPACE")"
  mkdir -p "$WORKSPACE"

  echo "開始匯出 workspace skills..."
  copy_skill_dir "$WORKSPACE/.agents/skills"
  copy_skill_dir "$WORKSPACE/skills"
fi

echo
echo "完成。"
