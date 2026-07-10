#!/bin/bash
# 验证监控大盘所有组件是否创建成功

echo "=== 监控大盘组件验证 ==="
echo ""

components=(
  "frontend/src/components/autopilot/AutopilotPanel.vue"
  "frontend/src/components/autopilot/TensionChart.vue"
  "frontend/src/components/autopilot/RealtimeLogStream.vue"
  "frontend/src/components/autopilot/VoiceDriftIndicator.vue"
  "frontend/src/components/autopilot/ForeshadowLedger.vue"
  "frontend/src/components/autopilot/CircuitBreakerStatus.vue"
  "frontend/src/components/autopilot/AutopilotDashboard.vue"
  "frontend/src/views/AutopilotMonitor.vue"
  "frontend/src/router/index.ts"
)

success=0
failed=0

for component in "${components[@]}"; do
  if [ -f "$component" ]; then
    echo "✅ $component"
    ((success++))
  else
    echo "❌ $component (不存在)"
    ((failed++))
  fi
done

echo ""
echo "=== 验证结果 ==="
echo "成功: $success"
echo "失败: $failed"

if [ $failed -eq 0 ]; then
  echo ""
  echo "🎉 所有组件创建成功！"
  exit 0
else
  echo ""
  echo "⚠️ 有组件缺失，请检查"
  exit 1
fi
