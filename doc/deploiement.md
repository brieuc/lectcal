# Déploiement de lectcal

L'app est servie par un conteneur `nginx:alpine` (`lectcal`), exposé en HTTPS par le reverse proxy `nginx-proxy` sur `https://vps-4ac2e447.vps.ovh.net/lectcal/`.

## Répertoires

| Où | Chemin | Contenu |
|---|---|---|
| Mac | `~/Documents/projets/lectcal/` | code, `Dockerfile`, `docker-compose.yml` |
| Mac | `~/Documents/projets/lectcal/sons/` | les `.m4a` (source) |
| Mac | `~/Documents/projets/nginx-proxy/` | `docker-compose.yml` et `nginx.conf` du proxy |
| VPS | dossier du projet lectcal (au choix) | même contenu que sur le Mac, sans `sons/` |
| VPS | `/var/app/lectcal/sons/` | sons servis (monté dans le conteneur) |
| VPS | dossier du projet nginx-proxy | `nginx.conf` à tenir à jour |
| Conteneur | `/usr/share/nginx/html/` | `index.html`, `manifest.json` |
| Conteneur | `/usr/share/nginx/html/sons/` | vue sur `/var/app/lectcal/sons` (lecture seule) |

Le volume du `docker-compose.yml` se lit `chemin_hôte:chemin_conteneur:ro`. Le dossier `/usr/share/nginx/html/sons` est dans le conteneur : il n'y a rien à y faire à la main.

## Arborescence des sons

Noms en majuscules, extension `.m4a`, accents compris (`À.m4a`).

| Page | Dossier | Fichiers |
|---|---|---|
| Alphabet | `sons/` | `A.m4a` … `Z.m4a` |
| Voyelles | `sons/` | `A`, `E`, `I`, `O`, `U`, `Y`, `OU`, `AU`, `ON`, `AN`, `EN`, `IN`, `UN` |
| Petits mots | `sons/mots/` | `UN`, `UNE`, `DES`, `LE`, `LA`, `LES`, `ET`, `EST`, `IL`, `ELLE`, `À`, `DE`, `DU`, `EN`, `AU`, `SUR`, `SOUS`, `DANS`, `AVEC`, `MON` |
| Nombres | `sons/nombres/` | `1.m4a` … `99.m4a` |

`UN`, `EN` et `AU` existent à deux endroits (`sons/` pour les voyelles, `sons/mots/` pour les mots).

## Commandes

### Envoyer les sons (depuis le Mac)

```
rsync -av sons/ debian@IP_VPS:/var/app/lectcal/sons/
```

### Premier déploiement (sur le VPS)

```
mkdir -p /var/app/lectcal/sons/mots /var/app/lectcal/sons/nombres
cd <dossier lectcal>
docker compose up -d --build
docker exec nginx_reverse_proxy nginx -s reload
```

Lancer le conteneur `lectcal` **avant** de recharger nginx. Sinon le reload échoue avec `host not found in upstream`, et un restart du proxy coupe cashtag et dailymon.

### Mise à jour du code (`index.html`, `manifest.json`)

```
docker compose up -d --build
```

### Mise à jour des sons

Un `rsync` suffit, sans rebuild. Vider le cache du navigateur si un son a changé.

### Mise à jour du proxy

```
docker exec nginx_reverse_proxy nginx -t
docker exec nginx_reverse_proxy nginx -s reload
```

### Diagnostic

```
docker compose ps                                  # état du conteneur
docker logs -f lectcal                             # logs
docker exec lectcal ls /usr/share/nginx/html/sons  # sons visibles par le conteneur
docker network inspect web                         # lectcal doit y figurer
```

### Nettoyage

```
docker images                  # lister les images
docker image prune             # supprimer les images orphelines
docker image prune -a          # supprimer toutes les images non utilisées
docker compose down            # arrêter et supprimer le conteneur lectcal
```
