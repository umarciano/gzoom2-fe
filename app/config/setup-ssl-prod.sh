#!/bin/bash
# =============================================================================
# GZOOM - Setup Apache SSL per produzione (172.20.128.11)
# Bilanciatore Fabrizio → 172.20.128.11:443 (HTTPS con cert self-signed)
#
# Eseguire come root sul server di produzione:
#   chmod +x setup-ssl-prod.sh
#   sudo ./setup-ssl-prod.sh
# =============================================================================

set -e

echo "=========================================="
echo " GZOOM - Setup Apache SSL Produzione"
echo "=========================================="

# --- 1. Installa mod_ssl se non presente ---
echo "[1/5] Installazione mod_ssl..."
dnf install -y mod_ssl
echo "      mod_ssl installato."

# --- 2. Crea directory per i certificati ---
echo "[2/5] Creazione directory certificati..."
mkdir -p /etc/httpd/ssl
chmod 700 /etc/httpd/ssl

# --- 3. Genera certificato self-signed (valido 10 anni) ---
echo "[3/5] Generazione certificato self-signed..."
openssl req -x509 -nodes -days 3650 \
    -newkey rsa:2048 \
    -keyout /etc/httpd/ssl/gzoom-selfsigned.key \
    -out    /etc/httpd/ssl/gzoom-selfsigned.crt \
    -subj "/C=IT/ST=Campania/L=Napoli/O=AORN Cardarelli/OU=IT/CN=performance.ospedalecardarelli.it"

chmod 600 /etc/httpd/ssl/gzoom-selfsigned.key
chmod 644 /etc/httpd/ssl/gzoom-selfsigned.crt
echo "      Certificato generato in /etc/httpd/ssl/"

# --- 4. Deploy configurazione Apache ---
echo "[4/5] Deploy configurazione Apache..."
CONF_SRC="/opt/gzoom-app/GZOOM_CARDARELLI/workspace/gzoom2-fe/app/config/httpd-gzoom-prod-ssl.conf"
CONF_DST="/etc/httpd/conf.d/gzoom.conf"

# Rimuovi eventuali configurazioni precedenti
rm -f /etc/httpd/conf.d/gzoom*.conf

cp "$CONF_SRC" "$CONF_DST"
echo "      Configurazione copiata in $CONF_DST"

# --- 5. Apri porta 443 nel firewall e riavvia Apache ---
echo "[5/5] Firewall e riavvio Apache..."
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-service=http   # per il redirect 80→443
firewall-cmd --reload

# Verifica configurazione prima di riavviare
echo "      Test configurazione Apache..."
apachectl configtest

systemctl enable httpd
systemctl restart httpd

echo ""
echo "=========================================="
echo " SETUP COMPLETATO"
echo "=========================================="
echo ""
echo " Apache in ascolto su:"
echo "   :80  → redirect a https (opzionale)"
echo "   :443 → applicazione GZOOM (SSL self-signed)"
echo ""
echo " Verifica che il bilanciatore Fabrizio punti a:"
echo "   172.20.128.11:443"
echo ""
echo " Test locale dal server:"
echo "   curl -k https://localhost/gzoom2/"
echo "   curl -k https://localhost/gzoom/control/main"
echo "   curl -k https://localhost/rest/health"
echo ""
echo " Test certificato:"
echo "   openssl s_client -connect localhost:443 -servername performance.ospedalecardarelli.it"
echo "=========================================="
