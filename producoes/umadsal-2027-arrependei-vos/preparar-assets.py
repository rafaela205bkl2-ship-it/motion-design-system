"""
Prepara as imagens do filme em public/producoes/umadsal-2027-arrependei-vos/imagens/.

Entradas (pasta --origem):
  drive/   arquivos do Drive da produção: umadsal-logo-white.png, ID 2027.pdf (extraído com
           `pdfimages -j "ID 2027.pdf" p` → p-000.jpg … p-006.jpg), PHOTO-…jpeg
  art/     obras em domínio público (Wikimedia Commons, reproduções fiéis de obras 2D):
           adam.jpg      Michelangelo – Creation of Adam (cropped).jpg
           athens.jpg    "The School of Athens" by Raffaello Sanzio da Urbino.jpg
           vitruvian.jpg Vitruvian Man by Leonardo da Vinci.jpg
           expulsion_mich.jpg     Michelangelo, Fall and Expulsion from Garden of Eden 00.jpg
           expulsion_masaccio.jpg Masaccio-TheExpulsionOfAdamAndEveFromEden-Restoration.jpg
           prodigal.jpg  Rembrandt – Return of the Prodigal Son – Google Art Project.jpg

Regras: a marca (logo, lettering, camisas, paleta) NÃO é redesenhada. Só há ampliação com
reconstrução de borda (alpha) — as formas e cores continuam as dos arquivos originais.
"""
import argparse, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

Image.MAX_IMAGE_PIXELS = None
ap = argparse.ArgumentParser()
ap.add_argument("--origem", required=True)
a = ap.parse_args()
O = a.origem
D = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
                 "public", "producoes", "umadsal-2027-arrependei-vos", "imagens")
os.makedirs(D, exist_ok=True)
P = lambda *p: os.path.join(O, *p)


def save_jpg(im, name, maxw=3840, q=90):
    im = im.convert("RGB")
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(os.path.join(D, name), quality=q, optimize=True)
    print(name, im.size)


def crisp_alpha(alpha, S, k=0.12):
    a = alpha.resize((alpha.width * S, alpha.height * S), Image.LANCZOS).filter(ImageFilter.GaussianBlur(S * 0.55))
    A = np.asarray(a).astype(float) / 255
    A = np.clip((A - 0.5) / k + 0.5, 0, 1)
    return A * A * (3 - 2 * A)


# ---- lettering oficial ARREPENDEI-VOS (pág. 1 do PDF), fundo creme removido por desmistura
im = np.asarray(Image.open(P("drive", "p-000.jpg")).convert("RGB")).astype(float)
bg = np.median(im[:50, :50].reshape(-1, 3), 0)
al = np.maximum(np.clip((bg[1] - im[..., 1]) / (bg[1] - 10), 0, 1), np.clip((bg[2] - im[..., 2]) / (bg[2] - 15), 0, 1))
al = np.clip((al - 0.04) / 0.92, 0, 1)
ys, xs = np.where(al > 0.1)
x0, x1, y0, y1 = xs.min() - 12, xs.max() + 12, ys.min() - 12, ys.max() + 12
sa, s = al[y0:y1, x0:x1], im[y0:y1, x0:x1]
C = np.clip((s - (1 - sa[..., None]) * bg) / np.maximum(sa[..., None], 1e-3), 0, 255)
m = sa > 0.6
idx = ndimage.distance_transform_edt(~m, return_distances=False, return_indices=True)
C = C[idx[0], idx[1]]
S = 8
A = crisp_alpha(Image.fromarray((sa * 255).astype(np.uint8)), S)
Cu = np.asarray(Image.fromarray(C.astype(np.uint8)).resize((A.shape[1], A.shape[0]), Image.BICUBIC).filter(ImageFilter.GaussianBlur(S))).astype(float)
Image.fromarray(np.dstack([Cu, A * 255]).astype(np.uint8), "RGBA").save(os.path.join(D, "lettering-arrependei-vos.png"), optimize=True)
print("lettering-arrependei-vos.png", A.shape[::-1], "fundo creme oficial", bg)

# ---- logo oficial (branco) em HD + símbolo e palavra separados
lg = Image.open(P("drive", "umadsal-logo-white.png"))
A = crisp_alpha(lg.getchannel("A"), 4, 0.14)
L = Image.fromarray(np.dstack([np.full(A.shape + (3,), 255), A * 255]).astype(np.uint8), "RGBA")
L.save(os.path.join(D, "umadsal-logo.png"), optimize=True)
L.crop((0, 0, 1100, L.height)).save(os.path.join(D, "umadsal-simbolo.png"), optimize=True)
print("umadsal-logo.png", L.size)

# ---- páginas da identidade (ampliadas 2x para movimentos de câmera)
for src, name in (("p-002.jpg", "camisas-2027.jpg"), ("p-004.jpg", "paleta-2027.jpg")):
    im = Image.open(P("drive", src)).resize((3840, 2160), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2.5, 60, 2))
    save_jpg(im, name)
# papel preto da pág. 4 sem o símbolo (para o logotipo completo entrar sobre a mesma textura)
pg = np.asarray(Image.open(P("drive", "p-006.jpg")).convert("RGB")).astype(float)
h, w = pg.shape[:2]
yy, xx = np.mgrid[:h, :w]
mask = np.clip((100 - np.hypot(xx - 966, yy - 538)) / 22, 0, 1)  # círculo do símbolo, borda suave
patch = np.roll(pg, 260, axis=1)
clean = pg * (1 - mask[..., None]) + patch * mask[..., None]
save_jpg(Image.fromarray(clean.astype(np.uint8)).resize((3840, 2160), Image.LANCZOS), "papel-preto.jpg")
save_jpg(Image.open(P("drive", "p-006.jpg")).resize((3840, 2160), Image.LANCZOS), "papel-preto-simbolo.jpg")

# ---- obras (domínio público)
save_jpg(Image.open(P("art", "adam.jpg")), "criacao-de-adao.jpg")
save_jpg(Image.open(P("art", "athens.jpg")), "escola-de-atenas.jpg", 3600)
v = Image.open(P("art", "vitruvian.jpg"))
save_jpg(v.crop((0, 0, v.width, int(v.height * 0.44))), "homem-vitruviano.jpg", 3200)  # metade superior
save_jpg(Image.open(P("art", "expulsion_mich.jpg")), "expulsao-michelangelo.jpg")
ms = Image.open(P("art", "expulsion_masaccio.jpg"))
ms = ms.crop((ms.width // 2, 0, ms.width, int(ms.height * 0.47)))  # versão restaurada, só a metade superior
save_jpg(ms.resize((ms.width * 2, ms.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 50, 2)), "expulsao-masaccio.jpg")
save_jpg(Image.open(P("art", "prodigal.jpg")), "filho-prodigo.jpg", 3200)
