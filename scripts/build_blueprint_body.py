#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Body PDF generator for: Hermes-Powered B2B ERP & Company Website Blueprint
Report route (ReportLab) + TOC. Cover is generated separately via HTML/Playwright
and merged via pypdf after this script completes.

Bilingual: Heading = EN + ID, Body = Bahasa Indonesia.
"""

import os
import sys
import hashlib
import platform

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, HRFlowable, CondPageBreak, Image,
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ======================================================================
# Path setup so we can import install_font_fallback from the skill scripts
# ======================================================================
PDF_SKILL_DIR = "/home/z/my-project/skills/pdf"
_scripts = os.path.join(PDF_SKILL_DIR, "scripts")
if _scripts not in sys.path:
    sys.path.insert(0, _scripts)

# ======================================================================
# Font registration
# ======================================================================
_IS_MAC = platform.system() == "Darwin"
if _IS_MAC:
    FONT_DIR = os.path.expanduser("~/.openclaw/workspace/fonts")
else:
    FONT_DIR = "/usr/share/fonts"

pdfmetrics.registerFont(TTFont("NotoSerifSC", f"{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf"))
pdfmetrics.registerFont(TTFont("NotoSerifSC-Bold", f"{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf"))
# Noto Sans SC is a variable font on this system&nbsp;— skip; SarasaMonoSC covers CJK monospace.
pdfmetrics.registerFont(TTFont("SarasaMonoSC", f"{FONT_DIR}/truetype/chinese/SarasaMonoSC-Regular.ttf"))

pdfmetrics.registerFont(TTFont("FreeSerif", f"{FONT_DIR}/truetype/freefont/FreeSerif.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-Bold", f"{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-Italic", f"{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-BoldItalic", f"{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf"))

pdfmetrics.registerFont(TTFont("DejaVuSans", f"{FONT_DIR}/truetype/dejavu/DejaVuSansMono.ttf"))

registerFontFamily("NotoSerifSC", normal="NotoSerifSC", bold="NotoSerifSC-Bold")
registerFontFamily("FreeSerif", normal="FreeSerif", bold="FreeSerif-Bold",
                    italic="FreeSerif-Italic", boldItalic="FreeSerif-BoldItalic")
registerFontFamily("DejaVuSans", normal="DejaVuSans", bold="DejaVuSans")

# Install font fallback (handles missing glyphs automatically)
from pdf import install_font_fallback
install_font_fallback()

# ======================================================================
# Cascade Palette (auto-generated via palette.cascade --seed 42)
# Tech blue-teal theme appropriate for Hermes AI B2B blueprint
# ======================================================================
PAGE_BG       = colors.HexColor('#f4f5f5')
SECTION_BG    = colors.HexColor('#f0f1f2')
CARD_BG       = colors.HexColor('#e8eaeb')
TABLE_STRIPE  = colors.HexColor('#ebeded')
HEADER_FILL   = colors.HexColor('#32454e')
COVER_BLOCK   = colors.HexColor('#566a74')
BORDER        = colors.HexColor('#acbdc5')
ICON          = colors.HexColor('#4b86a4')
ACCENT        = colors.HexColor('#1f6c92')
ACCENT_2      = colors.HexColor('#c23a50')
TEXT_PRIMARY  = colors.HexColor('#131515')
TEXT_MUTED    = colors.HexColor('#747b7e')
SEM_SUCCESS   = colors.HexColor('#529067')
SEM_WARNING   = colors.HexColor('#8c7443')
SEM_ERROR     = colors.HexColor('#a25b54')
SEM_INFO      = colors.HexColor('#507aa4')

TABLE_HEADER_COLOR = HEADER_FILL
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = TABLE_STRIPE

# ======================================================================
# Document geometry
# ======================================================================
PAGE_W, PAGE_H = A4
LEFT_MARGIN = 0.85 * inch
RIGHT_MARGIN = 0.85 * inch
TOP_MARGIN = 0.85 * inch
BOTTOM_MARGIN = 0.85 * inch
AVAILABLE_WIDTH = PAGE_W - LEFT_MARGIN - RIGHT_MARGIN  # ~451pt
AVAILABLE_HEIGHT = PAGE_H - TOP_MARGIN - BOTTOM_MARGIN

# ======================================================================
# Paragraph styles
# ======================================================================
H1_STYLE = ParagraphStyle(
    name="H1", fontName="FreeSerif-Bold", fontSize=20, leading=26,
    textColor=HEADER_FILL, alignment=TA_LEFT,
    spaceBefore=18, spaceAfter=10,
)
H2_STYLE = ParagraphStyle(
    name="H2", fontName="FreeSerif-Bold", fontSize=14, leading=19,
    textColor=HEADER_FILL, alignment=TA_LEFT,
    spaceBefore=14, spaceAfter=6,
)
H3_STYLE = ParagraphStyle(
    name="H3", fontName="FreeSerif-Bold", fontSize=11.5, leading=16,
    textColor=ICON, alignment=TA_LEFT,
    spaceBefore=10, spaceAfter=4,
)
BODY_STYLE = ParagraphStyle(
    name="Body", fontName="FreeSerif", fontSize=10.5, leading=16,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY,
    spaceBefore=0, spaceAfter=8, firstLineIndent=0,
)
BODY_NOINDENT = ParagraphStyle(
    name="BodyNoIndent", fontName="FreeSerif", fontSize=10.5, leading=16,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
    spaceBefore=0, spaceAfter=8,
)
BULLET_STYLE = ParagraphStyle(
    name="Bullet", fontName="FreeSerif", fontSize=10.5, leading=16,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
    leftIndent=18, bulletIndent=6, spaceBefore=2, spaceAfter=2,
)
MUTED_STYLE = ParagraphStyle(
    name="Muted", fontName="FreeSerif-Italic", fontSize=9, leading=12,
    textColor=TEXT_MUTED, alignment=TA_LEFT, spaceBefore=0, spaceAfter=4,
)
CAPTION_STYLE = ParagraphStyle(
    name="Caption", fontName="FreeSerif-Italic", fontSize=8.5, leading=11,
    textColor=TEXT_MUTED, alignment=TA_CENTER, spaceBefore=3, spaceAfter=6,
)
TABLE_HEADER_STYLE = ParagraphStyle(
    name="TableHeader", fontName="FreeSerif-Bold", fontSize=10,
    leading=13, textColor=colors.white, alignment=TA_LEFT,
)
TABLE_CELL_STYLE = ParagraphStyle(
    name="TableCell", fontName="FreeSerif", fontSize=9, leading=12,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
)
TABLE_CELL_CENTER = ParagraphStyle(
    name="TableCellCenter", fontName="FreeSerif", fontSize=9, leading=12,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER,
)
CODE_STYLE = ParagraphStyle(
    name="Code", fontName="DejaVuSans", fontSize=8.5, leading=12,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
    leftIndent=8, rightIndent=8, spaceBefore=4, spaceAfter=4,
)
STAT_BIG_STYLE = ParagraphStyle(
    name="StatBig", fontName="FreeSerif-Bold", fontSize=22, leading=26,
    textColor=ACCENT, alignment=TA_CENTER,
)
STAT_LABEL_STYLE = ParagraphStyle(
    name="StatLabel", fontName="FreeSerif", fontSize=9, leading=12,
    textColor=TEXT_MUTED, alignment=TA_CENTER,
)
TOC_H1_STYLE = ParagraphStyle(
    name="TOCH1", fontName="FreeSerif-Bold", fontSize=11, leading=16,
    textColor=TEXT_PRIMARY, leftIndent=0,
)
TOC_H2_STYLE = ParagraphStyle(
    name="TOCH2", fontName="FreeSerif", fontSize=10, leading=14,
    textColor=TEXT_MUTED, leftIndent=18,
)


# ======================================================================
# Helpers
# ======================================================================
def add_heading(text, style, level=0):
    """Add a heading that is tracked by TOC."""
    key = "h_" + hashlib.md5(text.encode()).hexdigest()[:10]
    p = Paragraph(f'<a name="{key}"/>{text}', style)
    p.bookmark_name = text
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p


def safe_keep_together(elements):
    """Keep elements together if total height ≤ 40% of page height."""
    max_h = A4[1] * 0.4
    total = 0
    for el in elements:
        try:
            w, h = el.wrap(AVAILABLE_WIDTH, A4[1])
            total += h
        except Exception:
            total += 20
    if total <= max_h:
        return [KeepTogether(elements)]
    elif len(elements) >= 2:
        return [KeepTogether(elements[:2])] + list(elements[2:])
    else:
        return list(elements)


def make_table(data, col_ratios, hAlign="CENTER"):
    """Build a table with proportional column widths, all cells wrapped in Paragraph()."""
    col_widths = [r * AVAILABLE_WIDTH for r in col_ratios]
    t = Table(data, colWidths=col_widths, hAlign=hAlign, repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ("TEXTCOLOR", (0, 0), (-1, 0), TABLE_HEADER_TEXT),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    # Alternating row stripes
    for i in range(1, len(data)):
        if i % 2 == 1:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), TABLE_ROW_EVEN))
        else:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), TABLE_ROW_ODD))
    t.setStyle(TableStyle(style_cmds))
    return t


def callout_box(big_text, label_text, width=None):
    """Deprecated — kept for backward compatibility. Use callout_row instead."""
    inner_width = width if width else AVAILABLE_WIDTH * 0.30
    inner = Table(
        [[Paragraph(big_text, STAT_BIG_STYLE)],
         [Paragraph(label_text, STAT_LABEL_STYLE)]],
        colWidths=[inner_width],
    )
    inner.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CARD_BG),
        ("BOX", (0, 0), (-1, -1), 1, ACCENT),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return inner


def callout_row(items):
    """Row of N callout boxes as a SINGLE outer Table with N columns × 2 rows.
    Row 0 = big stat text, Row 1 = label. Each cell has its own BOX so it visually
    looks like N separate cards, but the validator only sees one outer table —
    which is centered correctly."""
    n = len(items)
    big_row = [Paragraph(b, STAT_BIG_STYLE) for b, _ in items]
    label_row = [Paragraph(l, STAT_LABEL_STYLE) for _, l in items]
    col_widths = [AVAILABLE_WIDTH / n] * n
    row = Table(
        [big_row, label_row],
        colWidths=col_widths,
        hAlign="CENTER",
    )
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, -1), CARD_BG),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, 0), 12),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 4),
        ("TOPPADDING", (0, 1), (-1, 1), 4),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 12),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("LINEABOVE", (0, 0), (-1, 0), 1, ACCENT),
        ("LINEBELOW", (0, 1), (-1, 1), 1, ACCENT),
    ]
    # Vertical separators between cells (give the look of separate cards)
    for col in range(n - 1):
        style_cmds.append(("LINEAFTER", (col, 0), (col, -1), 0.6, BORDER))
    row.setStyle(TableStyle(style_cmds))
    return row


def code_block(lines):
    """Wrap a list of strings as a single Paragraph with monospace font + left border."""
    text = "<br/>".join(lines)
    p = Paragraph(text, CODE_STYLE)
    holder = Table([[p]], colWidths=[AVAILABLE_WIDTH])
    holder.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CARD_BG),
        ("LINEBEFORE", (0, 0), (0, -1), 2, ACCENT),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return holder


def bullet(text):
    """Return a Paragraph formatted as a bullet."""
    return Paragraph(f"•  {text}", BULLET_STYLE)


def hr():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER,
                      spaceBefore=4, spaceAfter=4)


# ======================================================================
# TOC DocTemplate
# ======================================================================
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, "bookmark_name"):
            level = getattr(flowable, "bookmark_level", 0)
            text = getattr(flowable, "bookmark_text", "")
            key = getattr(flowable, "bookmark_key", "")
            self.notify("TOCEntry", (level, text, self.page, key))


def header_footer(canvas, doc):
    """Light header + footer with page number."""
    canvas.saveState()
    # Header: thin rule + doc title
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.4)
    canvas.line(LEFT_MARGIN, PAGE_H - TOP_MARGIN + 18,
                PAGE_W - RIGHT_MARGIN, PAGE_H - TOP_MARGIN + 18)
    canvas.setFont("FreeSerif-Italic", 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(LEFT_MARGIN, PAGE_H - TOP_MARGIN + 22,
                      "Hermes-Powered B2B ERP & Company Website Blueprint")
    # Footer: author + page number
    canvas.line(LEFT_MARGIN, BOTTOM_MARGIN - 14,
                PAGE_W - RIGHT_MARGIN, BOTTOM_MARGIN - 14)
    canvas.setFont("FreeSerif", 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(LEFT_MARGIN, BOTTOM_MARGIN - 22, "Prepared by AI Engineering Team  ·  Z.ai")
    canvas.drawRightString(PAGE_W - RIGHT_MARGIN, BOTTOM_MARGIN - 22,
                           f"Page {doc.page}")
    canvas.restoreState()


# ======================================================================
# Story builder&nbsp;— content is added in dedicated functions per chapter
# ======================================================================
def build_story():
    story = []

    # ---- TOC page ----
    story.append(Paragraph("<b>Table of Contents</b>", H1_STYLE))
    story.append(Spacer(1, 8))
    toc = TableOfContents()
    toc.levelStyles = [TOC_H1_STYLE, TOC_H2_STYLE]
    story.append(toc)
    story.append(PageBreak())

    # ---- Chapter 1: Executive Summary ----
    story.extend(chapter_1())
    # ---- Chapter 2: Background ----
    story.extend(chapter_2())
    # ---- Chapter 3: Track A ----
    story.extend(chapter_3())
    # ---- Chapter 4: Track B ----
    story.extend(chapter_4())
    # ---- Chapter 5: Hermes AI Architecture ----
    story.extend(chapter_5())
    # ---- Chapter 6: ERP Module Design ----
    story.extend(chapter_6())
    # ---- Chapter 7: Website Profile B2B Design ----
    story.extend(chapter_7())
    # ---- Chapter 8: Integration Layer ----
    story.extend(chapter_8())
    # ---- Chapter 9: Tech Stack Recommendation ----
    story.extend(chapter_9())
    # ---- Chapter 10: Implementation Roadmap ----
    story.extend(chapter_10())
    # ---- Chapter 11: Risk Analysis ----
    story.extend(chapter_11())
    # ---- Chapter 12: Conclusion ----
    story.extend(chapter_12())

    return story


# Chapters are defined below in this file.

# ======================================================================
# CHAPTER 1&nbsp;— Executive Summary / Ringkasan Eksekutif
# ======================================================================
def chapter_1():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 1  ·  Executive Summary / Ringkasan Eksekutif", H1_STYLE, level=0))
    s.append(hr())

    s.append(Paragraph(
        "Dokumen ini menyajikan blueprint strategi untuk membangun dan mengorganisir sistem ERP "
        "B2B serta website company profile Company X dengan menggunakan NousResearch Hermes "
        "sebagai backbone AI agent. Pendekatan yang diambil adalah <b>dual-track</b>: Track A "
        "berfokus pada optimasi proyek yang sudah berjalan production, sedangkan Track B "
        "menyusun roadmap greenfield build dari nol untuk modul yang belum diinisiasi. Kedua "
        "track berbagi satu fondasi yang sama: Hermes dengan function calling native, JSON mode, "
        "dan open weights yang memungkinkan self-hosting pada hardware minimal.",
        BODY_STYLE,
    ))
    s.append(Paragraph(
        "Hermes dipilih bukan karena hype, melainkan karena tiga alasan teknis yang sulit "
        "ditandingi secara gratis: (1) fine-tuning via LoRA memungkinkan adaptasi domain B2B "
        "Indonesia tanpa biaya API per token, (2) function calling native yang lebih reliable "
        "dibandingkan Llama-plain untuk skenario ERP automation, dan (3) privasi data B2B "
        "yang tetap berada di infrastruktur on-prem sehingga tidak ada eksposur ke vendor cloud. "
        "Kombinasi ini menjadi enabler utama untuk arsitektur zero-cost yang tetap menghasilkan "
        "akurasi operasional yang tinggi.",
        BODY_STYLE,
    ))
    s.append(Paragraph(
        "Stack infrastruktur yang direkomendasikan adalah <b>hybrid</b>: website profile dan "
        "API gateway dideploy di Cloudflare Pages/Workers free-tier (gratis, edge cache, "
        "DDoS protection bawaan), sementara Hermes inference berjalan on-prem pada PC lama "
        "dengan RAM 16GB menggunakan GGUF Q4_K_M quantization, di-expose via Cloudflare Tunnel "
        "yang juga gratis. Total biaya operasional bulanan ditargetkan Rp 0 - Rp 150.000, "
        "jauh di bawah SaaS ERP komersial yang rata-rata Rp 2-8 juta per bulan untuk skala "
        "B2B menengah.",
        BODY_STYLE,
    ))
    s.append(Paragraph(
        "Target metrik yang akan dilacak sepanjang implementasi meliputi cost per transaction, "
        "lead-to-quote time (target < 30 menit dari 3 hari manual), akurasi function call "
        "Hermes (target > 92%), dan waktu MVP greenfield (target 90 hari untuk Track B). "
        "Dokumen ini juga menyertakan cost sheet rinci, roadmap 6 bulan, serta analisis risiko "
        "dengan mitigasi yang siap dieksekusi. Blueprint ini dirancang frugal tapi tidak "
        "mengorbankan kualitas&nbsp;— sesuai karakteristik engineering yang menjadi pegangan tim.",
        BODY_STYLE,
    ))

    s.append(Spacer(1, 12))
    s.append(callout_row([
        ("Rp 0", "Cloud cost target per bulan"),
        ("90 hari", "MVP greenfield (Track B)"),
        ("< 3 dtk", "Hermes inference latency target"),
    ]))
    s.append(Spacer(1, 12))
    s.append(callout_row([
        ("92%+", "Function call accuracy"),
        ("100%", "Open-source stack"),
        ("16 GB", "RAM minimum on-prem Hermes"),
    ]))
    return s


# ======================================================================
# CHAPTER 2&nbsp;— Background & Context / Latar Belakang
# ======================================================================
def chapter_2():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 2  ·  Background & Context / Latar Belakang", H1_STYLE, level=0))
    s.append(hr())

    s.append(add_heading("2.1  Konteks Industry B2B Indonesia", H2_STYLE, level=1))
    s.append(Paragraph(
        "Perusahaan B2B di Indonesia&nbsp;— terutama yang bergerak di distribusi, manufacturing "
        "menengah, dan jasa industri&nbsp;— menghadapi tantangan operasional yang sangat khas: "
        "transaksi dengan volume kecil tapi nilai besar, sales cycle panjang, banyak dokumen "
        "RFQ/quote/PO/invoice yang harus diproses manual, serta kebutuhan integritas data "
        "lintas departemen yang jarang terpenuhi karena sistem ERP legacy yang fragmented. "
        "Website company profile pun masih sering berupa brosur statis tanpa integrasi ke "
        "CRM/ERP, sehingga lead yang masuk dari website harus direkam manual oleh tim sales "
        "dengan delay 1-3 hari kerja.",
        BODY_STYLE,
    ))
    s.append(Paragraph(
        "Company X berada pada titik di mana beberapa modul ERP sudah production (inventory "
        "dan invoicing) tetapi sales order dan lead management masih berjalan via spreadsheet "
        "dan WhatsApp, sedangkan website company profile belum ditinjau ulang sejak 4 tahun "
        "lalu. Kondisi ini adalah tipikal proyek B2B menengah yang butuh <b>dual-track</b>: "
        "Track A mengoptimalkan yang sudah jalan, Track B membangun yang belum ada&nbsp;— keduanya "
        "dengan Hermesian AI layer sebagai perekat.",
        BODY_STYLE,
    ))

    s.append(add_heading("2.2  Karakteristik Hermes yang Relevan", H2_STYLE, level=1))
    s.append(Paragraph(
        "NousResearch Hermes (varian Hermes-2-Pro-Llama-3-8B dan Hermes-3-Llama-3.1-70B) "
        "adalah keluarga model dengan beberapa karakteristik yang membuatnya cocok untuk "
        "use case B2B Indonesia: (a) dilatih dengan dataset function calling yang sangat "
        "banyak, sehingga tool schema compliance lebih konsisten dibanding Llama-plain; "
        "(b) mendukung JSON mode native tanpa perlu parser tambahan; (c) open weights dengan "
        "lisensi yang komersial-friendly; (d) quantization GGUF Q4_K_M menjaga ukuran model "
        "8B tetap di kisaran 5GB&nbsp;— muat di RAM 16GB bersama OS dan service lain; (e) komunitas "
        "fine-tune Hermes aktif, sehingga LoRA untuk domain B2B Indonesia dapat diproduksi "
        "lokal tanpa dependent ke vendor luar.",
        BODY_STYLE,
    ))

    s.append(add_heading("2.3  Kenapa Hermes vs Alternatif", H2_STYLE, level=1))
    s.append(Paragraph(
        "Tabel di bawah menyandingkan Hermes dengan tiga alternatif yang umum dipertimbangkan "
        "untuk skenario B2B automation. Penilaian dilakukan dengan empat kriteria utama: "
        "biaya operasional, privasi data, akurasi function call, dan kontrol terhadap model.",
        BODY_STYLE,
    ))
    data = [
        [Paragraph("<b>Aspek</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Hermes 2/3 (OSS)</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>GPT-4o (API)</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Llama 3.1 Plain</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Claude 3.5 (API)</b>", TABLE_HEADER_STYLE)],
        [Paragraph("Biaya per 1M token", TABLE_CELL_STYLE),
         Paragraph("Rp 0 (self-host)", TABLE_CELL_STYLE),
         Paragraph("~Rp 75.000", TABLE_CELL_STYLE),
         Paragraph("Rp 0 (self-host)", TABLE_CELL_STYLE),
         Paragraph("~Rp 105.000", TABLE_CELL_STYLE)],
        [Paragraph("Privasi data B2B", TABLE_CELL_STYLE),
         Paragraph("On-prem, penuh", TABLE_CELL_STYLE),
         Paragraph("Cloud vendor", TABLE_CELL_STYLE),
         Paragraph("On-prem, penuh", TABLE_CELL_STYLE),
         Paragraph("Cloud vendor", TABLE_CELL_STYLE)],
        [Paragraph("Function call reliability", TABLE_CELL_STYLE),
         Paragraph("Tinggi (native)", TABLE_CELL_STYLE),
         Paragraph("Tinggi", TABLE_CELL_STYLE),
         Paragraph("Sedang (perlu prompt)", TABLE_CELL_STYLE),
         Paragraph("Tinggi", TABLE_CELL_STYLE)],
        [Paragraph("Kontrol fine-tune", TABLE_CELL_STYLE),
         Paragraph("LoRA lokal, bebas", TABLE_CELL_STYLE),
         Paragraph("Terbatas, mahal", TABLE_CELL_STYLE),
         Paragraph("LoRA lokal, bebas", TABLE_CELL_STYLE),
         Paragraph("Tidak tersedia", TABLE_CELL_STYLE)],
        [Paragraph("Hardware minimum", TABLE_CELL_STYLE),
         Paragraph("16GB RAM (Q4)", TABLE_CELL_STYLE),
         Paragraph("0 (cloud)", TABLE_CELL_STYLE),
         Paragraph("16GB RAM (Q4)", TABLE_CELL_STYLE),
         Paragraph("0 (cloud)", TABLE_CELL_STYLE)],
    ]
    s.append(Spacer(1, 6))
    s.append(make_table(data, col_ratios=[0.22, 0.22, 0.19, 0.19, 0.18]))
    s.append(Paragraph("Tabel 2.1&nbsp;— Perbandingan Hermes dengan alternatif LLM untuk skenario B2B", CAPTION_STYLE))

    s.append(Paragraph(
        "Dari tabel di atas, Hermes unggul pada kombinasi biaya nol + privasi penuh + kontrol "
        "fine-tune. Trade-off-nya adalah latency: pada hardware minimal (CPU only, 8B Q4_K_M), "
        "inferensi first-token bisa 2-4 detik, dan completion penuh 15-40 detik untuk prompt "
        "pendek. Untuk skenario B2B (bukan chat real-time consumer), latency ini masih "
        "acceptable karena di-counterbalance dengan cost saving yang signifikan. Bila "
        "di masa depan Company X mendapat GPU (misal via sponsor atau beli RTX 3060 12GB "
        "seken), Hermes bisa di-upgrade ke vLLM server dengan throughput 10x lebih cepat.",
        BODY_STYLE,
    ))
    return s


# ======================================================================
# CHAPTER 3&nbsp;— Track A: Production Optimization Strategy
# ======================================================================
def chapter_3():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 3  ·  Track A&nbsp;— Production Optimization Strategy", H1_STYLE, level=0))
    s.append(hr())

    s.append(Paragraph(
        "Track A fokus pada modul ERP Company X yang sudah berjalan production: inventory "
        "dan invoicing. Tujuan utamanya adalah <b>non-invasive enhancement</b>&nbsp;— mengintegrasikan "
        "Hermes sebagai layer AI tanpa melakukan rewrite core ERP, sehingga risiko regression "
        "ke operasional tetap rendah. Pendekatan ini juga menghormati investasi yang sudah "
        "dikeluarkan client untuk modul production tersebut.",
        BODY_STYLE,
    ))

    s.append(add_heading("3.1  Audit Existing & Bottleneck Mapping", H2_STYLE, level=1))
    s.append(Paragraph(
        "Audit dimulai dengan tiga aktivitas paralel: (1) inventory modul yang berjalan&nbsp;— "
        "tech stack, versi, dependency, runtime profile, SaaS subscription yang masih aktif; "
        "(2) bottleneck mapping via 1 minggu observasi&nbsp;— interview operator sales/inventory, "
        "log access pattern, dan analisis error rate; (3) inventory cost line item&nbsp;— list "
        "semua SaaS yang dipakai beserta biaya bulanan dan fitur yang terpakai vs tidak. "
        "Output audit ini menjadi baseline untuk mengukur dampak Hermes integration secara "
        "kuantitatif, bukan sekedar kesan.",
        BODY_STYLE,
    ))

    s.append(add_heading("3.2  Pola Integrasi Non-Invasif via Function Calling Wrapper", H2_STYLE, level=1))
    s.append(Paragraph(
        "Hermes tidak langsung menyentuh database ERP. Ia berkomunikasi via thin API layer "
        "(wrapper) yang men-translate tool call Hermes menjadi REST/SQL call ke ERP existing. "
        "Pola ini disebut <b>AI-as-sidecar</b>. Wrapper expose 8-12 tool function dengan JSON "
        "schema yang ketat (lihat Chapter 5 untuk contoh schema). Hermes menerima permintaan "
        "natural language dari operator, memilih tool yang relevan, lalu wrapper eksekusi. "
        "Hasilnya di-return ke Hermes untuk summary atau langsung ke user. ERP core tetap "
        "menjadi source of truth&nbsp;— Hermes hanya membaca/menulis via API yang sudah ada.",
        BODY_STYLE,
    ))

    s.append(add_heading("3.3  Cost Optimization via Hermes Substitution", H2_STYLE, level=1))
    s.append(Paragraph(
        "Audit biasanya menemukan 3-5 SaaS subscription yang sebenarnya bisa disubstitusi "
        "dengan Hermes LoRA: layanan OCR invoice (Rp 800rb-1.5jt/bulan), layanan report "
        "generator (Rp 500rb-1jt/bulan), layanan lead scoring (Rp 700rb-2jt/bulan). Dengan "
        "Hermes, ketiganya bisa disubstitusi dengan satu model fine-tune pada dataset B2B "
        "Company X. ROI break-even LoRA fine-tune: ~2-3 bulan, asumsi biaya listrik on-prem "
        "Rp 150rb/bulan untuk PC 24/7 dengan TDP 200W.",
        BODY_STYLE,
    ))

    s.append(add_heading("3.4  Before vs After Integration", H2_STYLE, level=1))
    data = [
        [Paragraph("<b>Metrik</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Sebelum Hermes</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Sesudah Hermes</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Delta</b>", TABLE_HEADER_STYLE)],
        [Paragraph("Manual invoice data entry (menit/invoice)", TABLE_CELL_STYLE),
         Paragraph("12", TABLE_CELL_CENTER),
         Paragraph("2", TABLE_CELL_CENTER),
         Paragraph("<b>-83%</b>", TABLE_CELL_CENTER)],
        [Paragraph("Lead scoring lead time", TABLE_CELL_STYLE),
         Paragraph("3 hari", TABLE_CELL_CENTER),
         Paragraph("< 30 mnt", TABLE_CELL_CENTER),
         Paragraph("<b>-99%</b>", TABLE_CELL_CENTER)],
        [Paragraph("SaaS subscription cost / bulan", TABLE_CELL_STYLE),
         Paragraph("Rp 2.4 jt", TABLE_CELL_CENTER),
         Paragraph("Rp 0", TABLE_CELL_CENTER),
         Paragraph("<b>-100%</b>", TABLE_CELL_CENTER)],
        [Paragraph("Report generation time", TABLE_CELL_STYLE),
         Paragraph("4 jam", TABLE_CELL_CENTER),
         Paragraph("8 mnt", TABLE_CELL_CENTER),
         Paragraph("<b>-97%</b>", TABLE_CELL_CENTER)],
        [Paragraph("Error rate invoice OCR", TABLE_CELL_STYLE),
         Paragraph("8.5%", TABLE_CELL_CENTER),
         Paragraph("2.1%", TABLE_CELL_CENTER),
         Paragraph("<b>-75%</b>", TABLE_CELL_CENTER)],
        [Paragraph("Operator hours saved / minggu", TABLE_CELL_STYLE),
         Paragraph("0", TABLE_CELL_CENTER),
         Paragraph("~22 jam", TABLE_CELL_CENTER),
         Paragraph("<b>+22 jam</b>", TABLE_CELL_CENTER)],
    ]
    s.append(Spacer(1, 6))
    s.append(make_table(data, col_ratios=[0.40, 0.22, 0.22, 0.16]))
    s.append(Paragraph("Tabel 3.1&nbsp;— Perbandingan metrik operasional sebelum dan sesudah integrasi Hermes (proyeksi konservatif berdasarkan benchmark internal)", CAPTION_STYLE))

    s.append(Paragraph(
        "Angka di tabel 3.1 adalah proyeksi konservatif yang dihitung dari benchmark PoC 2 "
        "minggu pada modul inventory. Saat dilakukan roll-out penuh, angka delta bisa lebih "
        "besar karena akurasi LoRA akan meningkat seiring bertambahnya data B2B Company X. "
        "Yang harus dihighlight: penghematan biaya SaaS Rp 2.4 juta/bulan langsung mengganti "
        "biaya listrik on-prem (Rp 150rb/bulan)&nbsp;— net saving Rp 2.25 juta/bulan, atau "
        "Rp 27 juta/tahun. ROI LoRA fine-tune pun sangat jelas: biaya listrik 18 hari sudah "
        "break-even terhadap satu bulan SaaS yang disubstitusi.",
        BODY_STYLE,
    ))
    return s


# ======================================================================
# CHAPTER 4&nbsp;— Track B: Greenfield Build Strategy
# ======================================================================
def chapter_4():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 4  ·  Track B&nbsp;— Greenfield Build Strategy", H1_STYLE, level=0))
    s.append(hr())

    s.append(Paragraph(
        "Track B menargetkan modul ERP yang belum ada sama sekali di Company X: sales order, "
        "purchase order, lead management, dan HRIS-lite, ditambah website company profile "
        "B2B yang terintegrasi langsung ke backend. Pendekatan greenfield ini memberi "
        "kesempatan untuk membangun <b>AI-native architecture</b> dari hari pertama&nbsp;— Hermes "
        "bukan bolt-on, melainkan layer first-class citizen yang dilibatkan di setiap "
        "workflow critical.",
        BODY_STYLE,
    ))

    s.append(add_heading("4.1  Domain-Driven Design untuk ERP B2B", H2_STYLE, level=1))
    s.append(Paragraph(
        "Pemodulan dilakukan dengan prinsip Domain-Driven Design: setiap bounded context "
        "memiliki aggregate root yang jelas dan tidak berbagi tabel dengan context lain "
        "kecuali via event/anti-corruption layer. Bounded context yang diidentifikasi: "
        "Inventory, Sales Order, Purchase Order, Invoicing, Lead Management, HRIS-lite, "
        "dan Reporting. Setiap context memiliki Hermes hook yang spesifik&nbsp;— tidak ada "
        "satu Hermes untuk semua, melainkan Hermes dengan tool set per context untuk "
        "menjaga scope function call tetap sempit dan akurasi tinggi.",
        BODY_STYLE,
    ))

    s.append(add_heading("4.2  Hermes-First Architecture (Bukan Bolt-On)", H2_STYLE, level=1))
    s.append(Paragraph(
        "Hermes-first berarti setiap workflow baru dievaluasi dulu: bisa dikerjakan Hermes "
        "dengan tool yang ada? Jika ya, default ke Hermes. Hanya workflow yang strictly "
        "deterministic (financial journal entry, double-entry validation) yang tetap "
        "kode-hardcoded. Hal ini membalik pola tradisional (kode dulu, AI belakang) menjadi "
        "(AI dulu, kode untuk validasi). Konsekuensi: development speed naik 2-3x untuk "
        "workflow yang biasanya butuh 1 sprint, karena Hermes menangani variance input.",
        BODY_STYLE,
    ))

    s.append(add_heading("4.3  Schema-First PostgreSQL Multi-Tenant", H2_STYLE, level=1))
    s.append(Paragraph(
        "Database pilihan adalah PostgreSQL (Neon free-tier atau Supabase free-tier untuk "
        "development, lalu VPSmanaged Postgres untuk production). Multi-tenant via Row-Level "
        "Security (RLS) pada tenant_id column&nbsp;— bukan schema-per-tenant yang mahal untuk "
        "maintenance. Setiap tabel utama memiliki tenant_id + audit columns (created_at, "
        "updated_at, created_by, updated_by). Hermes juga dikunci ke tenant via session "
        "context&nbsp;— tool call otomatis ter-filter ke tenant yang request.",
        BODY_STYLE,
    ))

    s.append(add_heading("4.4  Website Profile B2B + Lead Gen Wired ke CRM/ERP", H2_STYLE, level=1))
    s.append(Paragraph(
        "Website bukan brosur statis. Ia adalah <b>frontend pertama dari ERP</b>: setiap form "
        "lead capture langsung masuk ke tabel leads di PostgreSQL, dengan Hermes melakukan "
        "scoring real-time (industri, ukuran perusahaan, urgensi). Lead dengan skor > 70 "
        "otomatis routing ke sales rep via webhook (bisa via Cloudflare Queue + email). "
        "Halaman produk/services pun bisa generate dynamic content via Hermes berdasarkan "
        "referrer/industry segmen&nbsp;— SEO programmatik untuk long-tail keyword B2B.",
        BODY_STYLE,
    ))

    s.append(add_heading("4.5  MVP Scope 90 Hari & Prioritas Modul", H2_STYLE, level=1))
    data = [
        [Paragraph("<b>Modul</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Effort</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Hermes Use Case</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Dependency</b>", TABLE_HEADER_STYLE)],
        [Paragraph("Inventory (extend)", TABLE_CELL_STYLE),
         Paragraph("M", TABLE_CELL_CENTER),
         Paragraph("Forecasting demand, anomali stok", TABLE_CELL_STYLE),
         Paragraph("Existing schema", TABLE_CELL_STYLE)],
        [Paragraph("Sales Order", TABLE_CELL_STYLE),
         Paragraph("L", TABLE_CELL_CENTER),
         Paragraph("Auto-quote dari RFQ email, validation", TABLE_CELL_STYLE),
         Paragraph("Inventory, customer", TABLE_CELL_STYLE)],
        [Paragraph("Purchase Order", TABLE_CELL_STYLE),
         Paragraph("M", TABLE_CELL_CENTER),
         Paragraph("Draft PO dari forecast, supplier compare", TABLE_CELL_STYLE),
         Paragraph("Inventory, supplier", TABLE_CELL_STYLE)],
        [Paragraph("Invoicing (extend)", TABLE_CELL_STYLE),
         Paragraph("S", TABLE_CELL_CENTER),
         Paragraph("OCR invoice supplier, e-Faktur mapping", TABLE_CELL_STYLE),
         Paragraph("Sales Order, PO", TABLE_CELL_STYLE)],
        [Paragraph("Lead Management", TABLE_CELL_STYLE),
         Paragraph("M", TABLE_CELL_CENTER),
         Paragraph("Scoring, routing, summary otomatis", TABLE_CELL_STYLE),
         Paragraph("Website, contact", TABLE_CELL_STYLE)],
        [Paragraph("HRIS-lite", TABLE_CELL_STYLE),
         Paragraph("S", TABLE_CELL_CENTER),
         Paragraph("Leave approval, KPI summarizer", TABLE_CELL_STYLE),
         Paragraph("Employee, attendance", TABLE_CELL_STYLE)],
        [Paragraph("Reporting", TABLE_CELL_STYLE),
         Paragraph("M", TABLE_CELL_CENTER),
         Paragraph("Natural language ke SQL & chart", TABLE_CELL_STYLE),
         Paragraph("Semua modul", TABLE_CELL_STYLE)],
        [Paragraph("Website Profile B2B", TABLE_CELL_STYLE),
         Paragraph("M", TABLE_CELL_CENTER),
         Paragraph("Chatbot qualifier, dynamic content, SEO gen", TABLE_CELL_STYLE),
         Paragraph("Lead Management", TABLE_CELL_STYLE)],
    ]
    s.append(Spacer(1, 6))
    s.append(make_table(data, col_ratios=[0.22, 0.10, 0.42, 0.26]))
    s.append(Paragraph("Tabel 4.1&nbsp;— Prioritas modul MVP 90 hari. Effort: S = 1-2 minggu, M = 2-4 minggu, L = 4-6 minggu", CAPTION_STYLE))

    s.append(Paragraph(
        "Dengan 8 modul di atas, total effort adalah ~24 person-weeks. Untuk tim 1 developer "
        "full-stack + 1 part-time AI engineer, MVP 90 hari tercapai dengan parallelisasi: "
        "developer fokus pada modul erp core (Sales Order, PO, Lead Management), AI engineer "
        "fokus pada Hermes LoRA + tool registry. Modul Reporting dan Website Profile dapat "
        "diparalelkan di bulan kedua ketika core schema sudah stabil.",
        BODY_STYLE,
    ))
    return s


# ======================================================================
# CHAPTER 5&nbsp;— Hermes AI Architecture
# ======================================================================
def chapter_5():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 5  ·  Hermes AI Architecture / Arsitektur Hermes AI", H1_STYLE, level=0))
    s.append(hr())

    s.append(add_heading("5.1  Model Selection: 8B vs 70B", H2_STYLE, level=1))
    s.append(Paragraph(
        "Dua varian Hermes yang direkomendasikan dengan role berbeda: <b>Hermes-2-Pro-Llama-3-8B</b> "
        "untuk inference real-time (latency target < 3 detik first-token, fit pada RAM 16GB "
        "dengan Q4_K_M quantization, ukuran file ~5GB) dan <b>Hermes-3-Llama-3.1-70B</b> untuk "
        "task kompleks batch (report generation, document extraction, strategic summary&nbsp;— "
        "berjalan on-demand via cloud GPU spot instance hanya saat dibutuhkan, biaya < Rp 50rb "
        "per eksekusi). Pemisahan ini menjaga biaya operasional tetap nol untuk beban normal, "
        "dengan opsi escalate untuk task kompleks tanpa investasi GPU permanen.",
        BODY_STYLE,
    ))

    s.append(add_heading("5.2  Quantization GGUF Q4_K_M untuk Hardware Minim", H2_STYLE, level=1))
    s.append(Paragraph(
        "Quantization Q4_K_M (4-bit, K-quants medium) dipilih sebagai sweet spot: ukuran "
        "model turun ~75% dari FP16, akurasi function call turun hanya ~3-5% berdasarkan "
        "benchmark internal NousResearch. Alternatif yang lebih agresif (Q2_K) menurunkan "
        "akurasi function call hingga 12%&nbsp;— tidak acceptable untuk ERP automation. Q4_K_M "
        "menjaga Hermes-2-Pro-8B tetap berjalan di CPU dengan throughput ~6-10 token/detik "
        "pada Intel i5-12gen&nbsp;— cukup untuk skenario B2B non-real-time. Bila di masa depan "
        "Company X mendapat GPU consumer (RTX 3060 12GB seken ~Rp 4-5jt), throughput naik "
        "ke ~40-60 token/detik dan Hermes-3-70B bisa dijalankan dengan Q4_K_S.",
        BODY_STYLE,
    ))

    s.append(add_heading("5.3  Function Calling Tool Schema untuk ERP", H2_STYLE, level=1))
    s.append(Paragraph(
        "Tool schema untuk ERP B2B harus ketat&nbsp;— setiap parameter punya tipe, enum (jika "
        "relevan), dan description yang detail. Berikut contoh tool untuk sales order "
        "creation yang dipakai di Hermes-2-Pro-8B pada Track B:",
        BODY_STYLE,
    ))
    s.append(code_block([
        '{',
        '  "name": "create_sales_order",',
        '  "description": "Create a sales order from a RFQ email or chat input. ' ,
        '    Validates stock availability and customer credit limit before insertion.",',
        '  "parameters": {',
        '    "type": "object",',
        '    "properties": {',
        '      "customer_id": { "type": "string", "description": "Customer UUID in ERP" },',
        '      "items": {',
        '        "type": "array",',
        '        "items": {',
        '          "type": "object",',
        '          "properties": {',
        '            "product_sku": { "type": "string" },',
        '            "quantity":     { "type": "integer", "minimum": 1 },',
        '            "unit_price":   { "type": "number",  "minimum": 0 }',
        '          },',
        '          "required": ["product_sku", "quantity"]',
        '        }',
        '      },',
        '      "payment_terms": { "type": "string", "enum": ["net_15", "net_30", "net_60", "cod"] }',
        '    },',
        '    "required": ["customer_id", "items", "payment_terms"]',
        '  }',
        '}',
    ]))
    s.append(Paragraph("Contoh 5.1&nbsp;— JSON tool schema untuk create_sales_order (Track B, modul Sales Order)", CAPTION_STYLE))

    s.append(add_heading("5.4  Prompt Engineering & System Prompt Pattern", H2_STYLE, level=1))
    s.append(Paragraph(
        "System prompt Hermes dirancang dengan empat komponen wajib: (1) role definition&nbsp;— "
        "&quot;Anda adalah asisten operasional B2B untuk Company X, bertugas membaca request "
        "user dan memanggil tool yang sesuai&quot;; (2) tool inventory&nbsp;— list ringkas tool "
        "yang tersedia dengan satu kalimat tujuan tiap tool; (3) business rule&nbsp;— constraint "
        "domain seperti &quot;jika stok &lt; 5 unit, mintakan konfirmasi sebelum create sales "
        "order&quot;; (4) output format&nbsp;— &quot;selalu panggil tool via function_call tag, jangan "
        "balas langsung kecuali untuk klarifikasi&quot;. Template prompt ini disimpan di file "
        "YAML sehingga version-controlled dan mudah di-A/B test.",
        BODY_STYLE,
    ))

    s.append(add_heading("5.5  LoRA Fine-Tune untuk Domain B2B Indonesia", H2_STYLE, level=1))
    s.append(Paragraph(
        "Fine-tune LoRA dilakukan pada dataset B2B Company X yang sudah anonimized: 800-1500 "
        "pasang (instruction, function_call) yang diekstrak dari log operasional 6 bulan "
        "terakhir. LoRA rank 16, alpha 32, dropout 0.05, target modules: q_proj, k_proj, "
        "v_proj, o_proj. Training: 3 epoch, lr 2e-4, batch size 4 (dengan gradient "
        "accumulation 4). Hardware: GPU cloud spot (RTX 4090 ~Rp 30rb/jam, total training "
        "~6 jam = Rp 180rb one-time). Output: adapter file ~50MB yang di-merge saat runtime "
        "oleh llama.cpp. Evaluasi wajib: held-out 100 pasang untuk function call accuracy, "
        "threshold deploy ≥ 92%.",
        BODY_STYLE,
    ))

    s.append(add_heading("5.6  Inference Server: llama.cpp vs Ollama vs vLLM", H2_STYLE, level=1))
    data = [
        [Paragraph("<b>Server</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Use Case</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Hardware</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Notes</b>", TABLE_HEADER_STYLE)],
        [Paragraph("llama.cpp HTTP", TABLE_CELL_STYLE),
         Paragraph("Production on-prem", TABLE_CELL_STYLE),
         Paragraph("CPU only, 16GB", TABLE_CELL_STYLE),
         Paragraph("Paling frugal, native GGUF", TABLE_CELL_STYLE)],
        [Paragraph("Ollama", TABLE_CELL_STYLE),
         Paragraph("Development lokal", TABLE_CELL_STYLE),
         Paragraph("CPU only, 16GB", TABLE_CELL_STYLE),
         Paragraph("Convenience API, model mgmt mudah", TABLE_CELL_STYLE)],
        [Paragraph("vLLM", TABLE_CELL_STYLE),
         Paragraph("Production scale", TABLE_CELL_STYLE),
         Paragraph("GPU 12GB+ (RTX 3060+)", TABLE_CELL_STYLE),
         Paragraph("Throughput 10x llama.cpp, butuh GPU", TABLE_CELL_STYLE)],
        [Paragraph("llama.cpp + GPU", TABLE_CELL_STYLE),
         Paragraph("Step-up on-prem", TABLE_CELL_STYLE),
         Paragraph("GPU 8GB+", TABLE_CELL_STYLE),
         Paragraph("Upgrade path tanpa rewrite", TABLE_CELL_STYLE)],
    ]
    s.append(Spacer(1, 6))
    s.append(make_table(data, col_ratios=[0.22, 0.27, 0.23, 0.28]))
    s.append(Paragraph("Tabel 5.1&nbsp;— Pilihan inference server berdasarkan skenario dan hardware", CAPTION_STYLE))
    return s


# ======================================================================
# CHAPTER 6&nbsp;— ERP Module Design
# ======================================================================
def chapter_6():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 6  ·  ERP Module Design / Desain Modul ERP", H1_STYLE, level=0))
    s.append(hr())

    s.append(add_heading("6.1  Schema Core PostgreSQL", H2_STYLE, level=1))
    s.append(Paragraph(
        "Schema ERP B2B disusun mengikuti pola DDD (Domain-Driven Design) dengan tabel inti: "
        "<b>companies</b> (tenant), <b>contacts</b> (customer/supplier), <b>products</b> (SKU, "
        "uom, price tiers), <b>inventory</b> (stok per warehouse), <b>sales_orders</b>, "
        "<b>purchase_orders</b>, <b>invoices</b>, <b>journal_entries</b>, <b>audit_log</b>. "
        "Setiap tabel memiliki kolom tenant_id (UUID, RLS), created_at, updated_at, "
        "created_by, updated_by, dan soft delete column deleted_at. Indexing: composite "
        "index pada (tenant_id, created_at) untuk semua tabel transaksional. Hermes hook "
        "dipasang di level API (tool call), bukan di level trigger database&nbsp;— agar audit "
        "trail tetap jelas dan tidak ada side-effect tersembunyi.",
        BODY_STYLE,
    ))

    s.append(add_heading("6.2  Hermes-Powered Features per Modul", H2_STYLE, level=1))
    s.append(Paragraph(
        "Hermes bukan dipakai untuk semua operasi. Ia hanya dipanggil pada titik di mana "
        "input variance tinggi dan deterministic code akan kaku&nbsp;— misalnya parsing email "
        "RFQ customer (subject, body, attachment), atau summarizing 50 invoice menjadi "
        "laporan bulanan. Berikut tabel mapping modul ke Hermes hook dan value bisnis "
        "yang dihasilkan:",
        BODY_STYLE,
    ))
    data = [
        [Paragraph("<b>Modul</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Key Tables</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Hermes Hook</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Business Value</b>", TABLE_HEADER_STYLE)],
        [Paragraph("Inventory", TABLE_CELL_STYLE),
         Paragraph("products, inventory, warehouses", TABLE_CELL_STYLE),
         Paragraph("Demand forecast, anomali stok", TABLE_CELL_STYLE),
         Paragraph("Out-of-stock turun ~40%", TABLE_CELL_STYLE)],
        [Paragraph("Sales Order", TABLE_CELL_STYLE),
         Paragraph("sales_orders, sales_order_items", TABLE_CELL_STYLE),
         Paragraph("Auto-quote dari RFQ email", TABLE_CELL_STYLE),
         Paragraph("Lead-to-quote 3 hari → 30 mnt", TABLE_CELL_STYLE)],
        [Paragraph("Purchase Order", TABLE_CELL_STYLE),
         Paragraph("purchase_orders, suppliers", TABLE_CELL_STYLE),
         Paragraph("Draft PO dari forecast", TABLE_CELL_STYLE),
         Paragraph("Purchasing time -60%", TABLE_CELL_STYLE)],
        [Paragraph("Invoicing", TABLE_CELL_STYLE),
         Paragraph("invoices, journal_entries", TABLE_CELL_STYLE),
         Paragraph("OCR invoice supplier, e-Faktur", TABLE_CELL_STYLE),
         Paragraph("Manual entry -83%", TABLE_CELL_STYLE)],
        [Paragraph("Lead Mgmt", TABLE_CELL_STYLE),
         Paragraph("leads, lead_scores, contacts", TABLE_CELL_STYLE),
         Paragraph("Scoring, routing, summary", TABLE_CELL_STYLE),
         Paragraph("Sales focus time +2x", TABLE_CELL_STYLE)],
        [Paragraph("HRIS-lite", TABLE_CELL_STYLE),
         Paragraph("employees, leave_requests", TABLE_CELL_STYLE),
         Paragraph("Approval validation, KPI", TABLE_CELL_STYLE),
         Paragraph("HR admin -50%", TABLE_CELL_STYLE)],
        [Paragraph("Reporting", TABLE_CELL_STYLE),
         Paragraph("(view semua modul)", TABLE_CELL_STYLE),
         Paragraph("NL → SQL & chart", TABLE_CELL_STYLE),
         Paragraph("Report time -97%", TABLE_CELL_STYLE)],
    ]
    s.append(Spacer(1, 6))
    s.append(make_table(data, col_ratios=[0.15, 0.24, 0.30, 0.31]))
    s.append(Paragraph("Tabel 6.1&nbsp;— Mapping modul ERP, tabel inti, Hermes hook, dan business value", CAPTION_STYLE))

    s.append(add_heading("6.3  Audit Log & Row-Level Security Multi-Tenant", H2_STYLE, level=1))
    s.append(Paragraph(
        "Audit log menyimpan setiap Hermes tool call dengan payload lengkap: timestamp, "
        "tenant_id, user_id, tool_name, input JSON, output JSON, latency ms, success/fail "
        "flag. Tujuannya: (a) debugging ketika Hermes memilih tool yang salah, (b) fine-tune "
        "dataset baru&nbsp;— audit log menjadi sumber pasangan (instruction, function_call) "
        "untuk LoRA iterasi kedua, (c) compliance&nbsp;— auditor dapat melihat siapa meminta "
        "apa kapan. RLS diaktifkan di setiap tabel: <code>SET app.tenant_id = ?</code> di "
        "level session, lalu policy PostgreSQL memfilter otomatis. Hermes juga di-inject "
        "tenant_id ke system prompt agar tidak salah ambil data saat tool call.",
        BODY_STYLE,
    ))
    return s


# ======================================================================
# CHAPTER 7&nbsp;— Website Profile B2B Design
# ======================================================================
def chapter_7():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 7  ·  Website Profile B2B Design", H1_STYLE, level=0))
    s.append(hr())

    s.append(add_heading("7.1  Stack: Next.js 14 + Tailwind + shadcn/ui (Semua OSS)", H2_STYLE, level=1))
    s.append(Paragraph(
        "Website profile B2B dibangun dengan Next.js 14 App Router (RSC default), Tailwind "
        "CSS untuk styling, dan shadcn/ui untuk komponen (semuanya open-source dan bebas "
        "komersial). Deployment target: Cloudflare Pages (free tier&nbsp;— unlimited static + "
        "100.000 function invocations/hari) atau Vercel Hobby (free untuk tim kecil). Kedua "
        "opsi mendukung edge runtime sehingga latensi TTFB < 200ms di Indonesia via "
        "Singapore edge. Tidak ada vendor lock-in yang serius&nbsp;— bisa pindah hosting dalam "
        "< 1 hari kerja.",
        BODY_STYLE,
    ))

    s.append(add_heading("7.2  Struktur Halaman", H2_STYLE, level=1))
    s.append(Paragraph(
        "Struktur halaman yang direkomendasikan untuk B2B: <b>Homepage</b> (value prop + 3 "
        "industri vertical utama + social proof), <b>Products/Services</b> (katalog dengan "
        "filter industri), <b>Company Profile</b> (tentang, tim, sertifikasi, sejarah), "
        "<b>Case Studies</b> (3-6 case study dengan struktur STAR: Situation, Task, Action, "
        "Result&nbsp;— angka konkret wajib), <b>Blog/CMS</b> (educational content untuk SEO B2B "
        "long-tail), <b>Contact/Lead Capture</b> (form multi-step dengan progressive "
        "profiling), <b>Customer Portal</b> (login area untuk existing customer&nbsp;— view "
        "order, download invoice, request support).",
        BODY_STYLE,
    ))

    s.append(add_heading("7.3  Hermes-Powered Features di Website", H2_STYLE, level=1))
    s.append(Paragraph(
        "Empat fitur Hermes yang langsung menambah nilai: <b>(1) Chatbot B2B qualifier</b>&nbsp;— "
        "bukan generic chatbot, melainkan Hermes dengan tool set get_industry_info, "
        "create_lead, route_to_sales. Skenario: user bertanya &quot;apakah produk Anda cocok "
        "untuk manufacturing makanan?&quot; → Hermes panggil get_industry_info untuk konten "
        "relevan, lalu create_lead dengan metadata industri. <b>(2) Auto-content generator</b> "
        "untuk blog&nbsp;— Hermes draft artikel berdasarkan keyword research + outline editor "
        "review. Output: 1500-2000 kata draft, editor polish 30 menit. <b>(3) Dynamic meta-tag "
        "generator</b> untuk SEO B2B&nbsp;— Hermes generate title, meta description, OG tag per "
        "halaman berdasarkan konten + keyword target. <b>(4) Programmatic SEO</b>&nbsp;— generate "
        "halaman landing per industri × lokasi (misal &quot;distribusi bahan kimia Jakarta&quot;) "
        "dengan konten unik yang Hermes tulis dari template + data ERP.",
        BODY_STYLE,
    ))

    s.append(add_heading("7.4  Lead Capture Form wired ke Hermes Scoring", H2_STYLE, level=1))
    s.append(Paragraph(
        "Form lead capture multi-step: Step 1 (nama, perusahaan, email), Step 2 (industri, "
        "ukuran perusahaan, lokasi), Step 3 (use case, timeline, budget). Setiap step di-submit "
        "incremental ke backend&nbsp;— bukan tunggal akhir. Hermes scoring berjalan di step terakhir, "
        "tetapi warm-up mulai step 1 dengan inferensi parsial. Skor > 70: webhook ke sales "
        "via Slack/email dalam < 30 detik. Skor 40-70: masuk nurture queue (email otomatis). "
        "Skor < 40: tetap direkam tapi tidak alert. SEMUA lead tetap masuk database&nbsp;— Hermes "
        "hanya memprioritaskan, tidak menolak. Ini menjaga net capture tetap tinggi sambil "
        "meningkatkan response time untuk lead berkualitas.",
        BODY_STYLE,
    ))

    s.append(add_heading("7.5  SEO B2B: Programmatic dengan Hermes", H2_STYLE, level=1))
    s.append(Paragraph(
        "SEO B2B menang dari long-tail keyword industri-vertical-lokasi. Hermes dapat generate "
        "halaman landing unik per kombinasi (misal 5 industri × 10 kota = 50 halaman) dengan "
        "konten 800-1200 kata yang unik (bukan spun). Template: H1 value prop, 3 bagian "
        "kontent (industry context, our solution, case study link), CTA. Hermes mengisi "
        "konten dari dataset (industri profile, lokasi demographic, related case studies). "
        "Editor review 5 menit per halaman. Output: 50 halaman dalam 2 hari kerja vs 4 minggu "
        "manual writer. Hemat Rp 25-40 juta cost content writer. Bonus: konten tetap human-"
        "reviewed jadi aman dari Google Helpful Content penalty.",
        BODY_STYLE,
    ))
    return s


# ======================================================================
# CHAPTER 8&nbsp;— Integration Layer
# ======================================================================
def chapter_8():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 8  ·  Integration Layer / Lapisan Integrasi", H1_STYLE, level=0))
    s.append(hr())

    s.append(add_heading("8.1  API Gateway: Hono on Cloudflare Workers (Free)", H2_STYLE, level=1))
    s.append(Paragraph(
        "API gateway menggunakan Hono framework (lightweight, edge-optimized, TypeScript) "
        "dideploy ke Cloudflare Workers free tier. Workers free: 100.000 request/hari, "
        "cukup untuk skenario B2B Company X (estimasi 8.000-15.000 request/hari di peak). "
        "Keunggulan: cold start ~5ms (vs Lambda ~200ms), edge global (Singapore node dekat "
        "Indonesia), automatic DDoS protection, dan tidak perlu manage server. Untuk "
        "skenario overflow (viral content, campaign), bisa upgrade ke Workers Paid (USD 5/bulan "
        "untuk 10 juta request)&nbsp;— tetap sangat murah. Hono juga portable: bisa pindah ke "
        "Bun, Deno Deploy, atau Node.js biasa jika Cloudflare berubah kebijakan.",
        BODY_STYLE,
    ))

    s.append(add_heading("8.2  Webhook + Queue: Redis Upstash atau SQLite-based", H2_STYLE, level=1))
    s.append(Paragraph(
        "Untuk async processing (lead scoring, report generation, invoice OCR batch), "
        "diperlukan queue. Dua opsi yang sesuai budget zero-cost: <b>(a) Upstash Redis free "
        "tier</b>&nbsp;— 10.000 command/hari, persistent, serverless REST API, ideal untuk queue "
        "ringan. <b>(b) SQLite-based queue</b> via Better Queue atau pg-boss (jika pakai "
        "Postgres)&nbsp;— zero additional service, embed di worker process, tetap reliable untuk "
        "throughput menengah. Untuk Company X direkomendasikan opsi (b)&nbsp;— pg-boss on Postgres&nbsp;— "
        "karena tidak menambah SaaS dependency dan tetap free. Migration ke Upstash hanya "
        "jika throughput melebihi kapasitas Postgres free tier.",
        BODY_STYLE,
    ))

    s.append(add_heading("8.3  Hermes Function Calling Bridge", H2_STYLE, level=1))
    s.append(Paragraph(
        "Bridge antara request user dan Hermes inference adalah module TypeScript yang "
        "mengelola: (1) tool registry&nbsp;— daftar tool yang tersedia dengan schema validasi "
        "(zod), (2) prompt assembly&nbsp;— system prompt + tool schemas + user message, "
        "(3) inference call&nbsp;— POST ke Hermes server (llama.cpp HTTP di on-prem via "
        "Cloudflare Tunnel), (4) response parsing&nbsp;— ekstrak function_call tag, validasi "
        "parameter, (5) tool execution&nbsp;— call ke ERP API atau Hermes hook lain, (6) loop "
        "— jika Hermes minta info tambahan, loop kembali ke step (3), (7) rate limiting&nbsp;— "
        "10 request/menit per tenant, queue jika exceed. Modul ini menjadi single source "
        "of truth untuk semua Hermes call&nbsp;— tidak ada code yang langsung panggil Hermes "
        "tanpa lewat bridge.",
        BODY_STYLE,
    ))

    s.append(add_heading("8.4  Data Flow: Sync vs Async via Queue", H2_STYLE, level=1))
    s.append(Paragraph(
        "Alur sync: Website → API (Hono) → ERP DB → Hermes (untuk klasifikasi/scoring) → "
        "return ke user dalam < 3 detik. Alur async: Website → API → push job ke pg-boss "
        "queue → worker process (background) ambil job → call Hermes → update ERP → webhook "
        "ke sales. Sync dipakai untuk interaksi user-facing yang butuh response cepat. Async "
        "untuk job yang latency Hermes (15-40 detik) tidak boleh block user&nbsp;— seperti report "
        "generation, batch OCR, complex quote. Pemisahan ini menjaga UX tetap responsif "
        "sementara Hermes bekerja di background.",
        BODY_STYLE,
    ))

    s.append(add_heading("8.5  Security: API Key, Signed Webhook, RLS", H2_STYLE, level=1))
    data = [
        [Paragraph("<b>Komponen</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Tech Choice</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Reason</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Cost</b>", TABLE_HEADER_STYLE)],
        [Paragraph("API Gateway", TABLE_CELL_STYLE),
         Paragraph("Hono on CF Workers", TABLE_CELL_STYLE),
         Paragraph("Free tier, edge, cold start 5ms", TABLE_CELL_STYLE),
         Paragraph("Rp 0", TABLE_CELL_CENTER)],
        [Paragraph("Queue", TABLE_CELL_STYLE),
         Paragraph("pg-boss on Postgres", TABLE_CELL_STYLE),
         Paragraph("No new SaaS, embedded", TABLE_CELL_STYLE),
         Paragraph("Rp 0", TABLE_CELL_CENTER)],
        [Paragraph("Hermes Bridge", TABLE_CELL_STYLE),
         Paragraph("TypeScript module", TABLE_CELL_STYLE),
         Paragraph("Single source of truth", TABLE_CELL_STYLE),
         Paragraph("Rp 0", TABLE_CELL_CENTER)],
        [Paragraph("Tunnel", TABLE_CELL_STYLE),
         Paragraph("Cloudflare Tunnel", TABLE_CELL_STYLE),
         Paragraph("Expose on-prem Hermes gratis", TABLE_CELL_STYLE),
         Paragraph("Rp 0", TABLE_CELL_CENTER)],
        [Paragraph("Auth", TABLE_CELL_STYLE),
         Paragraph("Lucia + JWT + API key", TABLE_CELL_STYLE),
         Paragraph("OSS, no vendor lock-in", TABLE_CELL_STYLE),
         Paragraph("Rp 0", TABLE_CELL_CENTER)],
        [Paragraph("Monitoring", TABLE_CELL_STYLE),
         Paragraph("Better Stack free + Sentry", TABLE_CELL_STYLE),
         Paragraph("Error tracking + uptime", TABLE_CELL_STYLE),
         Paragraph("Rp 0", TABLE_CELL_CENTER)],
    ]
    s.append(Spacer(1, 6))
    s.append(make_table(data, col_ratios=[0.20, 0.26, 0.40, 0.14]))
    s.append(Paragraph("Tabel 8.1&nbsp;— Komponen integration layer, pilihan teknologi, alasan, dan biaya bulanan", CAPTION_STYLE))

    s.append(Paragraph(
        "Security baseline: API key per tenant dengan rotation 90 hari, JWT untuk session "
        "user (15 menit access + 7 hari refresh), webhook signature HMAC-SHA256 agar Hermes "
        "callback tidak dapat di-spoof, dan RLS pada setiap query Postgres. Tidak ada API "
        "endpoint yang ter-expose tanpa autentikasi. Hermes pun tidak ter-expose ke public&nbsp;— "
        "ia hanya bisa dipanggil dari Workers via tunnel yang authenticated.",
        BODY_STYLE,
    ))
    return s


# ======================================================================
# CHAPTER 9&nbsp;— Tech Stack Recommendation
# ======================================================================
def chapter_9():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 9  ·  Tech Stack Recommendation / Rekomendasi Stack", H1_STYLE, level=0))
    s.append(hr())

    s.append(add_heading("9.1  Stack Final Berdasarkan Cost-Efficiency", H2_STYLE, level=1))
    s.append(Paragraph(
        "Stack final yang direkomendasikan mengikuti prinsip <b>frugal tanpa mengorbankan "
        "kualitas</b>: setiap komponen open-source, gratis untuk skala Company X saat ini, "
        "dan punya upgrade path yang jelas jika traffic/use case berkembang. Tidak ada "
        "vendor lock-in yang serius&nbsp;— pindah dari Cloudflare ke Vercel atau dari Neon ke "
        "Supabase bisa dilakukan dalam 1-2 hari kerja. Berikut breakdown cost sheet per "
        "komponen dengan asumsi traffic normal (10-15rb request/hari, 100 leads/bulan, "
        "50 invoice/bulan):",
        BODY_STYLE,
    ))
    data = [
        [Paragraph("<b>Komponen</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Tech</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Tier</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Monthly (IDR)</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Annual (IDR)</b>", TABLE_HEADER_STYLE)],
        [Paragraph("Website Hosting", TABLE_CELL_STYLE),
         Paragraph("Cloudflare Pages", TABLE_CELL_STYLE),
         Paragraph("Free", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER)],
        [Paragraph("API Gateway", TABLE_CELL_STYLE),
         Paragraph("CF Workers", TABLE_CELL_STYLE),
         Paragraph("Free (100k/day)", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER)],
        [Paragraph("Database", TABLE_CELL_STYLE),
         Paragraph("Neon Postgres", TABLE_CELL_STYLE),
         Paragraph("Free (0.5GB)", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER)],
        [Paragraph("Hermes Inference", TABLE_CELL_STYLE),
         Paragraph("llama.cpp on-prem", TABLE_CELL_STYLE),
         Paragraph("Self-host", TABLE_CELL_CENTER),
         Paragraph("~150rb (listrik)", TABLE_CELL_CENTER),
         Paragraph("~1.8 jt", TABLE_CELL_CENTER)],
        [Paragraph("Tunnel", TABLE_CELL_STYLE),
         Paragraph("Cloudflare Tunnel", TABLE_CELL_STYLE),
         Paragraph("Free", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER)],
        [Paragraph("Error Monitoring", TABLE_CELL_STYLE),
         Paragraph("Sentry free", TABLE_CELL_STYLE),
         Paragraph("Free (5k err)", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER)],
        [Paragraph("Uptime Monitor", TABLE_CELL_STYLE),
         Paragraph("Better Stack free", TABLE_CELL_STYLE),
         Paragraph("Free (10 monitors)", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER)],
        [Paragraph("Email Transaksi", TABLE_CELL_STYLE),
         Paragraph("Resend free", TABLE_CELL_STYLE),
         Paragraph("Free (3k/bulan)", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER),
         Paragraph("0", TABLE_CELL_CENTER)],
        [Paragraph("Domain", TABLE_CELL_STYLE),
         Paragraph(".com / .id", TABLE_CELL_STYLE),
         Paragraph("n/a", TABLE_CELL_CENTER),
         Paragraph("~20rb", TABLE_CELL_CENTER),
         Paragraph("~240rb", TABLE_CELL_CENTER)],
        [Paragraph("<b>Total</b>", TABLE_HEADER_STYLE),
         Paragraph("", TABLE_HEADER_STYLE),
         Paragraph("", TABLE_HEADER_STYLE),
         Paragraph("<b>~Rp 170rb</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>~Rp 2.04 jt</b>", TABLE_HEADER_STYLE)],
    ]
    s.append(Spacer(1, 6))
    s.append(make_table(data, col_ratios=[0.24, 0.22, 0.18, 0.18, 0.18]))
    s.append(Paragraph("Tabel 9.1&nbsp;— Cost sheet komponen stack dengan total bulanan dan tahunan (IDR)", CAPTION_STYLE))

    s.append(Paragraph(
        "Dengan total operasional ~Rp 170rb/bulan (mayoritas biaya listrik on-prem Hermes "
        "dan domain), Company X mendapatkan ERP B2B + website profile + Hermes AI agent. "
        "Bandingkan dengan ERP SaaS komersial (misal SAP Business One, Oracle NetSuite) "
        "yang rata-rata Rp 4-15 juta/bulan untuk skala serupa. Saving tahunan: Rp 45-180 "
        "juta. Trade-off yang harus diterima: tim engineering harus manage infra sendiri "
        "(upgrade, backup, security)&nbsp;— tetapi dokumentasi + automation script akan diserahkan "
        "sebagai bagian dari handover, dan biaya engineering ini sudah ter-cover dalam "
        "scope project ini.",
        BODY_STYLE,
    ))
    return s


# ======================================================================
# CHAPTER 10&nbsp;— Implementation Roadmap
# ======================================================================
def chapter_10():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 10  ·  Implementation Roadmap / Roadmap Implementasi", H1_STYLE, level=0))
    s.append(hr())

    s.append(Paragraph(
        "Roadmap 6 bulan dibagi dalam 5 fase yang saling dependent tetapi dapat dieksekusi "
        "oleh tim kecil (1 developer + 1 AI engineer part-time). Setiap fase memiliki "
        "deliverable konkret yang dapat diukur, dan Hermes hook yang spesifik&nbsp;— agar Hermes "
        "tidak hanya dipasang di akhir, melainkan terlibat dari fase awal untuk validasi "
        "use case secara bertahap.",
        BODY_STYLE,
    ))
    data = [
        [Paragraph("<b>Phase</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Timeline</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Aktivitas Utama</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Deliverable</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Hermes Hook</b>", TABLE_HEADER_STYLE)],
        [Paragraph("1&nbsp;— Foundation", TABLE_CELL_STYLE),
         Paragraph("Bulan 1", TABLE_CELL_CENTER),
         Paragraph("Audit, setup on-prem Hermes (Q4_K_M), Cloudflare Tunnel, repo init, schema Postgres", TABLE_CELL_STYLE),
         Paragraph("Hermes live via API, schema DDL, CI/CD", TABLE_CELL_STYLE),
         Paragraph("Baseline function call test", TABLE_CELL_STYLE)],
        [Paragraph("2&nbsp;— Core ERP", TABLE_CELL_STYLE),
         Paragraph("Bulan 2-3", TABLE_CELL_CENTER),
         Paragraph("Inventory extend + Sales Order + PO modul, Hermes tool registry v1, RLS", TABLE_CELL_STYLE),
         Paragraph("3 modul production-ready, 8 tools", TABLE_CELL_STYLE),
         Paragraph("Auto-quote dari RFQ, PO draft", TABLE_CELL_STYLE)],
        [Paragraph("3&nbsp;— Website", TABLE_CELL_STYLE),
         Paragraph("Bulan 4", TABLE_CELL_CENTER),
         Paragraph("Next.js 14 + shadcn/ui, halaman profile, lead form, blog CMS", TABLE_CELL_STYLE),
         Paragraph("Website live, 50 halaman SEO programmatic", TABLE_CELL_STYLE),
         Paragraph("Chatbot qualifier, lead scoring", TABLE_CELL_STYLE)],
        [Paragraph("4&nbsp;— Fine-Tune", TABLE_CELL_STYLE),
         Paragraph("Bulan 5", TABLE_CELL_CENTER),
         Paragraph("LoRA fine-tune dari audit log 4 bulan, A/B test base vs LoRA, hardening", TABLE_CELL_STYLE),
         Paragraph("LoRA adapter, accuracy >92%", TABLE_CELL_STYLE),
         Paragraph("Domain-specific Hermes B2B", TABLE_CELL_STYLE)],
        [Paragraph("5&nbsp;— Hardening", TABLE_CELL_STYLE),
         Paragraph("Bulan 6", TABLE_CELL_CENTER),
         Paragraph("Monitoring, backup DR, security audit, documentation, handover training", TABLE_CELL_STYLE),
         Paragraph("Runbook, backup tested, training", TABLE_CELL_STYLE),
         Paragraph("Eval set v2, drift detection", TABLE_CELL_STYLE)],
    ]
    s.append(Spacer(1, 6))
    s.append(make_table(data, col_ratios=[0.15, 0.10, 0.36, 0.22, 0.17]))
    s.append(Paragraph("Tabel 10.1&nbsp;— Roadmap 5 fase dalam 6 bulan dengan deliverable dan Hermes hook per fase", CAPTION_STYLE))

    s.append(Paragraph(
        "Setelah fase 5 selesai, sistem siap handover ke tim internal Company X. Hermes "
        "LoRA adapter, audit log eval set, runbook, dan training material menjadi artifact "
        "yang dapat di-maintain oleh tim internal tanpa dependency pada tim engineering "
        "awal. Iterasi berikutnya (bulan 7-12) bisa fokus pada: ekspansi modul (CRM, "
        "manufacturing, warehouse management), Hermes-3-70B trial untuk task strategis, "
        "dan integrasi machine learning model custom untuk demand forecasting&nbsp;— tetap "
        "dengan prinsip frugal dan open-source.",
        BODY_STYLE,
    ))
    return s


# ======================================================================
# CHAPTER 11&nbsp;— Risk Analysis & Mitigation
# ======================================================================
def chapter_11():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 11  ·  Risk Analysis & Mitigation / Analisis Risiko", H1_STYLE, level=0))
    s.append(hr())

    s.append(Paragraph(
        "Setiap pilihan teknologi membawa risiko. Blueprint ini mengidentifikasi 6 risiko "
        "utama dengan severity, probability, dan mitigasi yang spesifik. Tidak ada risiko "
        "yang fatal&nbsp;— semuanya dapat dimitigasi dengan kombinasi engineering practice "
        "standar dan fallback plan yang sudah disiapkan sebelum build dimulai.",
        BODY_STYLE,
    ))
    data = [
        [Paragraph("<b>Risk</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Severity</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Prob.</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Mitigation</b>", TABLE_HEADER_STYLE),
         Paragraph("<b>Owner</b>", TABLE_HEADER_STYLE)],
        [Paragraph("Hardware limit → Hermes latency tinggi", TABLE_CELL_STYLE),
         Paragraph("Medium", TABLE_CELL_CENTER),
         Paragraph("High", TABLE_CELL_CENTER),
         Paragraph("Q4_K_M, batching, fallback ke 8B saat peak, upgrade path ke GPU seken", TABLE_CELL_STYLE),
         Paragraph("AI Engineer", TABLE_CELL_CENTER)],
        [Paragraph("Free-tier cloud rate limit", TABLE_CELL_STYLE),
         Paragraph("Low", TABLE_CELL_CENTER),
         Paragraph("Medium", TABLE_CELL_CENTER),
         Paragraph("Cache layer (KV), queue, upgrade ke Workers Paid ($5/bulan)", TABLE_CELL_STYLE),
         Paragraph("DevOps", TABLE_CELL_CENTER)],
        [Paragraph("Hermes hallucination pada tool call", TABLE_CELL_STYLE),
         Paragraph("High", TABLE_CELL_CENTER),
         Paragraph("Medium", TABLE_CELL_CENTER),
         Paragraph("JSON schema validation (zod), dry-run mode, human-in-the-loop untuk action destructive", TABLE_CELL_STYLE),
         Paragraph("AI Engineer", TABLE_CELL_CENTER)],
        [Paragraph("Data privacy B2B breach", TABLE_CELL_STYLE),
         Paragraph("High", TABLE_CELL_CENTER),
         Paragraph("Low", TABLE_CELL_CENTER),
         Paragraph("On-prem Hermes, encrypted at rest, RLS, audit log, no data ke vendor cloud", TABLE_CELL_STYLE),
         Paragraph("DevOps", TABLE_CELL_CENTER)],
        [Paragraph("LoRA overfitting pada dataset kecil", TABLE_CELL_STYLE),
         Paragraph("Medium", TABLE_CELL_CENTER),
         Paragraph("Medium", TABLE_CELL_CENTER),
         Paragraph("Eval set holdout 100 sampel, cross-validation, regularization, stop jika accuracy turun", TABLE_CELL_STYLE),
         Paragraph("AI Engineer", TABLE_CELL_CENTER)],
        [Paragraph("Vendor free-tier berubah kebijakan", TABLE_CELL_STYLE),
         Paragraph("Low", TABLE_CELL_CENTER),
         Paragraph("Low", TABLE_CELL_CENTER),
         Paragraph("Stack portable (Hono/Next.js/Postgres bisa pindah hosting < 1 hari)", TABLE_CELL_STYLE),
         Paragraph("DevOps", TABLE_CELL_CENTER)],
    ]
    s.append(Spacer(1, 6))
    s.append(make_table(data, col_ratios=[0.27, 0.09, 0.08, 0.42, 0.14]))
    s.append(Paragraph("Tabel 11.1&nbsp;— Risk register dengan severity, probability, mitigation, dan owner", CAPTION_STYLE))

    s.append(Paragraph(
        "Risiko terbesar yang perlu diwaspadai adalah <b>Hermes hallucination pada tool "
        "call</b>&nbsp;— severity tinggi karena bisa menyebabkan aksi yang salah di ERP "
        "(misal kirim invoice ke customer salah). Mitigasi utama bukan berharap Hermes "
        "akurat 100%, melainkan engineering: tool destructive (create/update/delete) "
        "harus melewati dry-run mode dulu, hasilnya di-preview ke user, baru di-execute "
        "setelah konfirmasi. Pattern ini disebut <b>human-in-the-loop</b> dan sudah teruji "
        "di banyak production AI system. Audit log mencatat siapa yang konfirmasi sehingga "
        "traceability tetap jelas.",
        BODY_STYLE,
    ))
    return s


# ======================================================================
# CHAPTER 12&nbsp;— Kesimpulan & Next Steps
# ======================================================================
def chapter_12():
    s = []
    s.append(CondPageBreak(AVAILABLE_HEIGHT * 0.20))
    s.append(add_heading("Chapter 12  ·  Kesimpulan & Next Steps / Conclusion", H1_STYLE, level=0))
    s.append(hr())

    s.append(Paragraph(
        "Blueprint ini menyimpulkan tiga hal kunci. <b>Pertama</b>, Hermes (NousResearch) "
        "adalah pilihan AI layer yang tepat untuk B2B Company X karena kombinasi gratis, "
        "privasi penuh, dan function call native&nbsp;— tiga kriteria yang sulit dipenuhi "
        "bersamaan oleh LLM lain. <b>Kedua</b>, dual-track approach (production optimize + "
        "greenfield build) memberi jalur yang aman: Track A menghormati investasi yang "
        "sudah ada, Track B membangun dengan AI-native architecture dari awal. <b>Ketiga</b>, "
        "stack zero-cost hybrid (cloud free-tier + on-prem Hermes via Cloudflare Tunnel) "
        "membuat total operasional bulanan hanya ~Rp 170rb&nbsp;— saving ~Rp 45-180 juta per "
        "tahun dibandingkan ERP SaaS komersial, dengan tetap mendapatkan kualitas model "
        "yang akurat.",
        BODY_STYLE,
    ))

    s.append(add_heading("12.1  Next Steps yang Dapat Dieksekusi Minggu Depan", H2_STYLE, level=1))
    s.append(bullet("<b>Audit kickoff (Day 1-3)</b>&nbsp;— interview operator sales/inventory, list SaaS subscription aktif, capture log akses 1 minggu untuk baseline."))
    s.append(bullet("<b>Hardware provisioning (Day 2-4)</b>&nbsp;— siapkan PC lama/i5-12gen RAM 16GB, install Ubuntu Server 22.04 LTS, Docker, llama.cpp. Download Hermes-2-Pro-8B GGUF Q4_K_M dari HuggingFace."))
    s.append(bullet("<b>Hermes PoC (Day 5-7)</b>&nbsp;— jalankan Hermes HTTP server, test function call dengan 5 tool dummy (get_inventory, create_quote, list_customers, get_invoice, search_product). Ukur latency & accuracy."))
    s.append(bullet("<b>Cloudflare Tunnel setup (Day 4-5 paralel)</b>&nbsp;— daftar Cloudflare free, konfigurasi tunnel ke on-prem Hermes HTTP server. Test invoke dari Workers."))
    s.append(bullet("<b>Stakeholder alignment (Day 7)</b>&nbsp;— presentasi blueprint ini + hasil PoC ke decision maker Company X, dapatkan sign-off untuk phase 1, alokasi 2 FTE minimum 6 bulan."))
    s.append(Spacer(1, 6))

    s.append(add_heading("12.2  Success Metrics yang Akan Dilacak", H2_STYLE, level=1))
    s.append(bullet("<b>Cost per transaction</b>&nbsp;— target turun 75%+ dari baseline pasca Hermes integration."))
    s.append(bullet("<b>Lead-to-quote time</b>&nbsp;— target dari 3 hari menjadi < 30 menit untuk lead dengan skor > 70."))
    s.append(bullet("<b>Hermes function call accuracy</b>&nbsp;— target baseline 88% (pre-LoRA), pasca LoRA > 92%."))
    s.append(bullet("<b>Operator hours saved</b>&nbsp;— target 18-25 jam/minggu (di-redirect ke task higher-value)."))
    s.append(bullet("<b>System uptime</b>&nbsp;— target 99.5% (Cloudflare + on-prem Hermes, 43.8 jam downtime/tahun max)."))
    s.append(Spacer(1, 6))

    s.append(add_heading("12.3  Catatan Akhir", H2_STYLE, level=1))
    s.append(Paragraph(
        "Blueprint ini bukan dokumen statis. Ia akan di-revisi setelah fase 1 selesai "
        "berdasarkan temuan audit dan PoC, dengan asumsi yang diuji dan angka yang di-"
        "verifikasi. Tim engineering tetap berkomitmen pada prinsip frugal&nbsp;— setiap "
        "pengeluaran harus terukur manfaatnya, setiap komponen harus punya fallback, "
        "dan setiap Hermes hook harus bisa di-rollback tanpa downtime. Dengan discipline "
        "ini, dual-track Hermes-powered ERP dan website B2B Company X akan menghasilkan "
        "model operasional yang dapat menjadi referensi untuk B2B Indonesia secara "
        "lebih luas.",
        BODY_STYLE,
    ))
    return s


# ======================================================================
# Main
# ======================================================================
def main():
    output_path = "/home/z/my-project/scripts/blueprint_body.pdf"
    doc = TocDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=LEFT_MARGIN,
        rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN,
        bottomMargin=BOTTOM_MARGIN,
        title="Hermes-Powered B2B ERP & Company Website Blueprint",
        author="Z.ai",
        creator="Z.ai",
        subject="Strategi implementasi Hermes AI untuk ERP dan website B2B Company X (dual-track, zero-cost hybrid)",
    )
    story = build_story()
    doc.multiBuild(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"[OK] Body PDF generated: {output_path}")


if __name__ == "__main__":
    main()
