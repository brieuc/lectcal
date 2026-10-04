# Déploiement de lectcal

L'app est une application Vue (Vite) compilée au `docker build` (étape `node:24-alpine`), puis servie par un conteneur `nginx:alpine` (`lectcal`), exposé en HTTPS par le reverse proxy `nginx-proxy` sur `https://vps-4ac2e447.vps.ovh.net/lectcal/`.

Les sons ne sont pas dans le conteneur : comme les icônes de cashtag, ils sont servis directement par `nginx-proxy` depuis `/var/app/uploads/lectcal/` à l'URL `/uploads/lectcal/` (le proxy monte déjà `/var/app/uploads` en lecture seule).

## Répertoires

| Où | Chemin | Contenu |
|---|---|---|
| Mac | `~/Documents/projets/lectcal/` | code (`src/`, `index.html`, `public/`), `Dockerfile`, `docker-compose.yml` |
| Mac | `~/Documents/projets/lectcal/sons/` | les `.m4a` (source) |
| Mac | `~/Documents/projets/nginx-proxy/` | `docker-compose.yml` et `nginx.conf` du proxy |
| VPS | dossier du projet lectcal (au choix) | même contenu que sur le Mac, sans `sons/` |
| VPS | `/var/app/uploads/lectcal/sons/` | sons, servis par nginx-proxy à `/uploads/lectcal/sons/` |
| VPS | dossier du projet nginx-proxy | `nginx.conf` à tenir à jour |
| Conteneur | `/usr/share/nginx/html/` | le build Vite (`index.html`, `assets/`, `manifest.json`, `favicon.ico`, `config.js`) |

Le `location /uploads/lectcal/` de `nginx.conf` fait un `alias` vers `/var/app/uploads/lectcal/`, avec un cache de 1 jour.

## Configuration par environnement

L'URL des sons vient d'un `config.js`, chargé par `index.html` avant l'app. En production, il est généré au démarrage du conteneur par `default.conf.template` (nginx remplace `${SONS_URL}`) et prend le pas sur le `config.js` statique du build. En développement, `public/config.js` fixe `sons/`.

L'app utilise des adresses en `#/...` (routeur Vue en mode hash) et des chemins relatifs (`base: './'`), pour fonctionner derrière le préfixe `/lectcal/` du proxy.

| Fichier | `SONS_URL` | `SONS_HOST_DIR` | Usage |
|---|---|---|---|
| `.env` | `sons/` | `./sons` | local : le conteneur sert les sons du projet |
| `.env.prod` | `/uploads/lectcal/sons/` | `/var/app/uploads/lectcal/sons` | VPS : les sons sont servis par nginx-proxy |

- Local : `npm install` puis `npm run dev` (Vite sert aussi `sons/` depuis la racine du projet). Avec Docker, `.env` est lu automatiquement mais le compose ne publie aucun port et exige le réseau `web`.
- Production : `docker compose --env-file .env.prod up -d --build`.

Changer une variable demande un `up -d` (recréation du conteneur), pas de rebuild.

## Arborescence des sons

Noms en majuscules, extension `.m4a`, accents compris (`À.m4a`).

| Page | Dossier | Fichiers |
|---|---|---|
| Alphabet | `sons/` | `A.m4a` … `Z.m4a` |
| Voyelles | `sons/` | `A`, `E`, `I`, `O`, `U`, `Y`, `OU`, `AU`, `ON`, `AN`, `EN`, `IN`, `UN` |
| Petits mots | `sons/mots/` | `UN`, `UNE`, `DES`, `LE`, `LA`, `LES`, `ET`, `EST`, `IL`, `ELLE`, `À`, `DE`, `DU`, `EN`, `AU`, `SUR`, `SOUS`, `DANS`, `AVEC`, `MON` |
| Nombres | `sons/nombres/` | `1.m4a` … `99.m4a` |

`UN`, `EN` et `AU` existent à deux endroits (`sons/` pour les voyelles, `sons/mots/` pour les mots).

## Anciennes versions

`legacy.html` est l'ancienne version en JavaScript simple (sans build). Elle n'est plus déployée.

## Commandes

### Envoyer les sons (depuis le Mac)

```
rsync -av sons/ debian@IP_VPS:/var/app/uploads/lectcal/sons/
```

### Premier déploiement (sur le VPS)

```
mkdir -p /var/app/uploads/lectcal/sons/mots /var/app/uploads/lectcal/sons/nombres
cd <dossier lectcal>
docker compose --env-file .env.prod up -d --build
docker exec nginx_reverse_proxy nginx -s reload
```

Lancer le conteneur `lectcal` **avant** de recharger nginx. Sinon le reload échoue avec `host not found in upstream`, et un restart du proxy coupe cashtag et dailymon.

### Mise à jour du code (`src/`, `index.html`, `public/`)

Le build Vite est refait dans l'image à chaque `--build`.

```
docker compose --env-file .env.prod up -d --build
```

### Mise à jour des sons

Un `rsync` suffit, sans rebuild ni reload. Le cache navigateur est de 1 jour : le vider si un son a changé.

### Mise à jour du proxy

```
docker exec nginx_reverse_proxy nginx -t
docker exec nginx_reverse_proxy nginx -s reload
```

### Diagnostic

```
docker compose ps                                  # état du conteneur
docker logs -f lectcal                             # logs
docker exec nginx_reverse_proxy ls /var/app/uploads/lectcal/sons  # sons visibles par le proxy
docker network inspect web                         # lectcal doit y figurer
```

### Nettoyage

```
docker images                  # lister les images
docker image prune             # supprimer les images orphelines
docker image prune -a          # supprimer toutes les images non utilisées
docker compose down            # arrêter et supprimer le conteneur lectcal
```
