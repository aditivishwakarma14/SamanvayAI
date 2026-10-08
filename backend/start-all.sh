#!/bin/bash
cd "$(dirname "$0")" || exit 1

export AUTH_SERVICE="${AUTH_SERVICE:-http://localhost:8001}"
export CHAT_SERVICE="${CHAT_SERVICE:-http://localhost:8002}"
export AGENT_SERVICE="${AGENT_SERVICE:-http://localhost:8003}"
export BILLING_SERVICE="${BILLING_SERVICE:-http://localhost:8004}"

PUBLIC_PORT="${PORT:-8000}"

# start <dir> <port> <max heap in MB>
start() {
  (
    cd "$1" || exit 1
    PORT="$2" NODE_OPTIONS="--max-old-space-size=$3" exec node index.js
  ) &
}

start services/auth    8001 96
start services/chat    8002 96
start services/billing 8004 96
start services/agent   8003 192
start gateway "$PUBLIC_PORT" 96

trap 'kill 0' SIGTERM SIGINT

wait -n
code=$?
echo "A service exited (code $code). Stopping container so it restarts."
kill 0
exit "$code"