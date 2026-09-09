#!/usr/bin/env python3
"""Génère la présentation exécutive CMDT AI au format PDF 16:9.

Prérequis :  pip install reportlab
Usage     :  python scripts/build_pdf.py [sortie.pdf]
             (défaut : cmdt-ai-presentation.pdf à la racine du projet)
"""
import sys
from pathlib import Path

from reportlab.lib.colors import Color
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit

sys.path.insert(0, str(Path(__file__).resolve().parent))
from content import SLIDES, PRODUCT, CHAIN  # noqa: E402
from content import NAVY, LEAF, LEAF_SOFT, SOIL, INK, INK_MUTED, WHITE, CANVAS  # noqa: E402

PW, PH = 13.333 * inch, 7.5 * inch
MARGIN = 0.9 * inch


def col(t, alpha=1.0):
    return Color(t[0] / 255, t[1] / 255, t[2] / 255, alpha)


def para(c, text, x, y, width, font="Helvetica", size=13, leading=None, color=INK):
    leading = leading or size * 1.35
    c.setFont(font, size)
    c.setFillColor(col(color))
    for line in simpleSplit(text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def bullets(c, items, x, y, width, size=13):
    for it in items:
        c.setFont("Helvetica-Bold", size)
        c.setFillColor(col(LEAF))
        c.drawString(x, y, "•")
        y = para(c, it, x + 0.22 * inch, y, width - 0.22 * inch, size=size, color=INK)
        y -= size * 0.5
    return y


def logo(c, x, y, on_dark=False):
    c.setFillColor(col(LEAF))
    c.roundRect(x, y, 0.4 * inch, 0.4 * inch, 5, fill=1, stroke=0)
    c.setFillColor(col(NAVY))
    c.setFont("Times-Bold", 17)
    c.drawCentredString(x + 0.2 * inch, y + 0.1 * inch, "C")
    c.setFillColor(col(WHITE if on_dark else NAVY))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(x + 0.55 * inch, y + 0.12 * inch, "CMDT AI")


def footer(c, text):
    c.setFont("Helvetica", 8.5)
    c.setFillColor(col(INK_MUTED))
    c.drawString(MARGIN, 0.5 * inch, text)


def header(c, kicker, title):
    logo(c, MARGIN, PH - 0.95 * inch)
    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(col(LEAF))
    c.drawString(MARGIN, PH - 1.5 * inch, kicker.upper())
    c.setFont("Helvetica-Bold", 27)
    c.setFillColor(col(NAVY))
    y = PH - 1.55 * inch
    for line in simpleSplit(title, "Helvetica-Bold", 27, PW - 2 * MARGIN):
        y -= 0.42 * inch
        c.drawString(MARGIN, y, line)
    c.setFillColor(col(LEAF))
    c.rect(MARGIN, y - 0.28 * inch, 1.3 * inch, 3, fill=1, stroke=0)
    return y - 0.7 * inch


def page_cover(c, s):
    c.setFillColor(col(NAVY))
    c.rect(0, 0, PW, PH, fill=1, stroke=0)
    logo(c, MARGIN, PH - 1.1 * inch, on_dark=True)
    c.setFont("Helvetica-Bold", 46)
    c.setFillColor(col(WHITE))
    y = PH - 3.2 * inch
    for line in simpleSplit(s["title"], "Helvetica-Bold", 46, PW - 2 * MARGIN):
        c.drawString(MARGIN, y, line)
        y -= 0.62 * inch
    c.setFont("Helvetica", 21)
    c.setFillColor(col(LEAF_SOFT))
    y -= 0.1 * inch
    for line in simpleSplit(s["subtitle"], "Helvetica", 21, PW - 2 * MARGIN):
        c.drawString(MARGIN, y, line)
        y -= 0.4 * inch
    c.setFont("Helvetica", 13)
    c.setFillColor(col(WHITE))
    c.drawString(MARGIN, 1.5 * inch, s["note"])
    c.setFont("Helvetica", 8.5)
    c.setFillColor(col(LEAF_SOFT))
    c.drawString(MARGIN, 0.9 * inch,
                 f"{PRODUCT['org']}  ·  {PRODUCT['version']}  ·  {PRODUCT['disclaimer']}")


def page_content(c, s):
    c.setFillColor(col(CANVAS))
    c.rect(0, 0, PW, PH, fill=1, stroke=0)
    y = header(c, s["kicker"], s["title"])
    bullets(c, s["bullets"], MARGIN, y, PW - 2 * MARGIN, size=14)
    if s.get("footer"):
        footer(c, s["footer"])


def page_chain(c, s):
    c.setFillColor(col(CANVAS))
    c.rect(0, 0, PW, PH, fill=1, stroke=0)
    y = header(c, s["kicker"], s["title"])
    y = bullets(c, s["body"], MARGIN, y, PW - 2 * MARGIN, size=14)
    x = MARGIN
    cy = 1.5 * inch
    cw = (PW - 2 * MARGIN - 6 * 0.12 * inch) / 7
    for i, step in enumerate(CHAIN):
        c.setFillColor(col(NAVY if i % 2 == 0 else LEAF))
        c.roundRect(x, cy, cw, 0.5 * inch, 4, fill=1, stroke=0)
        c.setFillColor(col(WHITE))
        c.setFont("Helvetica-Bold", 9.5)
        c.drawCentredString(x + cw / 2, cy + 0.18 * inch, step)
        x += cw + 0.12 * inch
    footer(c, PRODUCT["url"])


def page_module(c, s):
    c.setFillColor(col(CANVAS))
    c.rect(0, 0, PW, PH, fill=1, stroke=0)
    c.setFillColor(col(NAVY))
    c.rect(0, 0, 2.4 * inch, PH, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 40)
    c.setFillColor(col(LEAF_SOFT))
    c.drawString(0.35 * inch, PH - 1.6 * inch, s["no"])
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(col(WHITE))
    c.drawString(0.35 * inch, PH - 2.1 * inch, "MODULE")

    left = 2.9 * inch
    width = PW - left - MARGIN
    c.setFont("Helvetica-Bold", 24)
    c.setFillColor(col(NAVY))
    y = PH - 1.0 * inch
    for line in simpleSplit(s["name"], "Helvetica-Bold", 24, width):
        c.drawString(left, y, line)
        y -= 0.38 * inch
    y -= 0.2 * inch
    for label, body in (("CONSTAT", s["what"]), ("POURQUOI", s["why"]),
                        ("ENJEU", s["sowhat"]), ("ACTION", s["nowwhat"])):
        c.setFont("Helvetica-Bold", 10.5)
        c.setFillColor(col(LEAF))
        c.drawString(left, y, label)
        y -= 0.24 * inch
        y = para(c, body, left, y, width, size=12.5, color=INK)
        y -= 0.22 * inch
    footer(c, f"{PRODUCT['name']} · {PRODUCT['tagline']}")


BUILDERS = {
    "cover": page_cover,
    "content": page_content,
    "chain": page_chain,
    "module": page_module,
}


def main():
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / "cmdt-ai-presentation.pdf"
    c = canvas.Canvas(str(out), pagesize=(PW, PH))
    c.setTitle("CMDT AI — Présentation exécutive")
    c.setAuthor(PRODUCT["org"])
    for s in SLIDES:
        BUILDERS[s["type"]](c, s)
        c.showPage()
    c.save()
    print(f"OK  {out}  ({len(SLIDES)} pages)")


if __name__ == "__main__":
    main()
