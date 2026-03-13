#!/bin/bash
# =============================================================================
# GZOOM2-FE - Avvio produzione (172.20.128.11)
#
# Usa il ng locale (node_modules/.bin/ng) per evitare conflitti
# con versioni globali di Angular CLI installate sul server.
#
# Il proxy (proxy.config.json) punta a localhost:8080 (OFBiz)
# e localhost:8081 (gzoom2-be REST) che girano sulla stessa macchina.
#
# Utilizzo:
#   chmod +x run-prod.sh
#   ./run-prod.sh
#
# Log:    $HOME/logs/gzoom2-app.out
# PID:    $HOME/logs/gzoom2-app.pid
# Stop:   kill $(cat $HOME/logs/gzoom2-app.pid)
# =============================================================================

mkdir -p $HOME/logs

# Usa ng locale per compatibilità con Angular 13 / Node richiesto
NG="$(dirname "$0")/node_modules/.bin/ng"

if [ ! -f "$NG" ]; then
    echo "[ERROR] ng non trovato in node_modules/.bin/ng"
    echo "        Eseguire: npm install"
    exit 1
fi

nohup "$NG" serve \
    -ec=true \
    --proxy-config proxy.config.json \
    --host 0.0.0.0 \
    --port 4200 \
    &> $HOME/logs/gzoom2-app.out &

cpid=$!
echo "Gzoom 2 frontend (PROD) started with PID: $cpid"
echo $cpid > $HOME/logs/gzoom2-app.pid
echo "Log: $HOME/logs/gzoom2-app.out"
echo "Stop: kill \$(cat \$HOME/logs/gzoom2-app.pid)"
