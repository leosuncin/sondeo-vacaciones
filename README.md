# Sondeo

Datos digitalizados del sondeo de precios hoteles de playa para vacaciones en El Salvador.

La fuente original de información del sonde para Julio 2019 puede encontrarse en: [https://www.defensoria.gob.sv/wp-content/uploads/2015/04/QQ-Hoteles.pdf](https://www.defensoria.gob.sv/wp-content/uploads/2015/04/QQ-Hoteles.pdf) (un espejo del documento puede encontrarse en este repositorio).

## Objetivo

Aprovechar los datos recopilados por la Defensoria del Consumidor para ofrecer una opción más acccesible para consultar los precios de hoteles de playa en La Libertad y la Costa del Sol para la temporada de vacaciones de agosto 2019.

## Plan

- [ ] Extraer y digitalizar datos del sondeo en formato editable.
- [ ] Brindar una interfaz para consumir los datos (API).
- [ ] Crear cliente web para consultar/filtrar datos.
- [ ] Crear cliente móvil para consultar/filtrar datos.

## Requisitos

Para extraer las imágenes del PDF necesito `pdftoppm` que es parte de [poppler](https://poppler.freedesktop.org/).

```bash
# Debian, Ubuntu, Linux Mint, y otras distribuciones basadas en Debian/Ubuntu
sudo apt install poppler-utils
```

```bash
# Fedora
sudo dnf install poppler-utils
```

```bash
# OpenSuse
sudo zypper install poppler-tools
```

```bash
# Arch linux
sudo pacman -S poppler
```
