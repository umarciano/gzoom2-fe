#!/bin/bash
# =============================================================================
# deploy-apache-conf.sh
# Copia il file di configurazione Apache corretto in base a GZOOM_ENV
#
# Utilizzo:
#   ./deploy-apache-conf.sh
#
# GZOOM_ENV deve essere impostato in ~/.bashrc:
#   export GZOOM_ENV=collaudo   (su server collaudo)
#   export GZOOM_ENV=prod       (su server prod)
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="/etc/httpd/conf.d/gzoom.conf"

GZOOM_ENV=${GZOOM_ENV:-local}

echo "=========================================="
echo " Deploy Apache config - Ambiente: $GZOOM_ENV"
echo "=========================================="

case "$GZOOM_ENV" in
  prod)
    SOURCE="$SCRIPT_DIR/httpd-gzoom-prod-ssl.conf"
    ;;
  collaudo)
    SOURCE="$SCRIPT_DIR/httpd-gzoom-collaudo.conf"
    ;;
  *)
    echo "[ERROR] GZOOM_ENV='$GZOOM_ENV' non riconosciuto."
    echo "        Valori validi: 'collaudo', 'prod'"
    echo "        Imposta GZOOM_ENV in ~/.bashrc e riprova."
    exit 1
    ;;
esac

if [ ! -f "$SOURCE" ]; then
  echo "[ERROR] File sorgente non trovato: $SOURCE"
  exit 1
fi

echo "[INFO] Copio: $SOURCE → $TARGET"
sudo cp "$SOURCE" "$TARGET"

echo "[INFO] Verifico sintassi Apache..."
sudo apachectl configtest
if [ $? -ne 0 ]; then
  echo "[ERROR] Errore nella configurazione Apache. Riavvio annullato."
  exit 1
fi

echo "[INFO] Riavvio Apache..."
sudo systemctl restart httpd

echo "[OK] Apache riavviato con configurazione: $GZOOM_ENV"
