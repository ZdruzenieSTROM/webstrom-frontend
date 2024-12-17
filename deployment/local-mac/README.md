# Ako pustit Docker na macOS

## Co pustam

- `docker-compose -f deployment/local-mac/compose.yaml up --build --force-recreate`
  - da sa prihodit aj `--detach` ked chceme pustit v backgrounde (bez neho vidime server logy priamo v terminali)

Treba mat samozrejme Docker a docker-compose atd.

## Urobene zmeny oproti compose-test

TODO: Docker Desktop 4.34 priniesol [host networking](https://docs.docker.com/engine/network/drivers/host/#docker-desktop), treba revisitnut

Ked som chcel pustit Docker na macu, musel som urobil nasledujuce zmeny (poradilo ChatGPT):

### `compose.yml`

- zmenil som aj meno suboru (lebo nebuildime "test" environment a.k.a test.strom.sk)
- vymena `network_mode: host` za explicitne `ports: - '3000:3000'` - network_mode vraj na macu nefunguje
- pridanie `- NEXT_PUBLIC_BE_HOSTNAME=host.docker.internal` - aby sa to vedelo pripojit na lokalny BE - Docker pouziva takyto hostname pre host machine localhost
- zmenil som porty na 3000/8000 ako standardne pouzivame pre development
- `dockerfile` a `context` cesty podla file struktury novych suborov

### `Dockerfile`

- host v `ENTRYPOINT`e na `"0.0.0.0"`
  - od ChatGPT: You're trying to start the application with `yarn start -H localhost`. This command might not be correctly binding to all network interfaces. Usually, you'd use `-H 0.0.0.0` to ensure the app listens on all interfaces, including those available within a Docker container. (a naozaj to pomohlo, inak mi stranku browser nenacital)
- pridany `ARG NEXT_PUBLIC_BE_HOSTNAME` pre nacitanie env varu z compose

### BE `settings.py`

- `ALLOWED_HOSTS = ['host.docker.internal']` - BE krical, ze treba :shrug:
