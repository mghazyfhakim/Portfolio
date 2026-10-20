#!/usr/bin/env python3
"""Merge cover PDF (page 1) + body PDF (TOC + 12 chapters) into final deliverable."""

import os
from pypdf import PdfReader, PdfWriter

A4_W, A4_H = 595.28, 841.89  # A4 in points

def normalize_page_to_a4(page):
    box = page.mediabox
    w, h = float(box.width), float(box.height)
    # Tighter tolerance — even sub-pixel mismatches cause pdf_qa to fail
    if abs(w - A4_W) > 0.3 or abs(h - A4_H) > 0.3:
        page.scale_to(A4_W, A4_H)
    return page

def merge_pdfs(cover_pdf, body_pdf, output_pdf):
    writer = PdfWriter()
    cover_page = PdfReader(cover_pdf).pages[0]
    writer.add_page(normalize_page_to_a4(cover_page))
    for page in PdfReader(body_pdf).pages:
        writer.add_page(normalize_page_to_a4(page))
    writer.add_metadata({
        "/Title": "Hermes-Powered B2B ERP & Company Website Blueprint",
        "/Author": "Z.ai",
        "/Creator": "Z.ai",
        "/Subject": "Strategi implementasi Hermes AI untuk ERP dan website B2B Company X (dual-track, zero-cost hybrid)",
    })
    with open(output_pdf, "wb") as f:
        writer.write(f)
    print(f"[OK] Merged PDF: {output_pdf}  ({len(writer.pages)} pages)")

if __name__ == "__main__":
    merge_pdfs(
        "/home/z/my-project/scripts/blueprint_cover.pdf",
        "/home/z/my-project/scripts/blueprint_body.pdf",
        "/home/z/my-project/download/Hermes_B2B_ERP_Website_Blueprint.pdf",
    )
