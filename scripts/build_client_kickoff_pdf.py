from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "WorkFlowOS_Client_Kickoff_and_Discovery.pdf"


BRAND = colors.HexColor("#0E1B27")
EMBER = colors.HexColor("#F97316")
SIGNAL = colors.HexColor("#18A999")
SAND = colors.HexColor("#F8EAD7")
LIGHT = colors.HexColor("#F6F7F9")
TEXT = colors.HexColor("#1E293B")
MUTED = colors.HexColor("#64748B")


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(inch, 0.55 * inch, "Symbiotic AI LLC | WorkFlowOS Client Kickoff & Discovery")
    canvas.drawRightString(LETTER[0] - inch, 0.55 * inch, f"Page {doc.page}")
    canvas.restoreState()


def cover(canvas, _doc):
    canvas.saveState()
    canvas.setFillColor(BRAND)
    canvas.rect(0, 0, LETTER[0], LETTER[1], fill=1, stroke=0)
    canvas.setFillColor(EMBER)
    canvas.rect(0, LETTER[1] - 1.1 * inch, LETTER[0], 0.16 * inch, fill=1, stroke=0)
    canvas.setFillColor(SIGNAL)
    canvas.rect(0, LETTER[1] - 1.28 * inch, LETTER[0] * 0.42, 0.07 * inch, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 28)
    canvas.drawString(inch, 6.95 * inch, "WorkFlowOS")
    canvas.setFont("Helvetica-Bold", 18)
    canvas.drawString(inch, 6.48 * inch, "Client Kickoff & Discovery Phase")
    canvas.setFont("Helvetica", 11)
    canvas.setFillColor(SAND)
    canvas.drawString(inch, 5.98 * inch, "Prepared by Symbiotic AI LLC")
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica", 12)
    canvas.drawString(inch, 4.9 * inch, "A practical next-step document for moving from demo to full licensed app setup.")
    canvas.setFillColor(SAND)
    canvas.setFont("Helvetica", 10)
    canvas.drawString(inch, 1.1 * inch, "Customized licensed workflow platform | Jobs | Roles | Inventory | Notifications")
    canvas.restoreState()


def styles():
    base = getSampleStyleSheet()
    return {
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=17,
            leading=22,
            textColor=BRAND,
            spaceBefore=12,
            spaceAfter=7,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=16,
            textColor=BRAND,
            spaceBefore=10,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.6,
            leading=13.2,
            textColor=TEXT,
            spaceAfter=5,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=MUTED,
            spaceAfter=4,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.4,
            leading=12.7,
            leftIndent=13,
            firstLineIndent=-8,
            textColor=TEXT,
            spaceAfter=3,
        ),
        "callout": ParagraphStyle(
            "callout",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10.2,
            leading=14,
            textColor=BRAND,
            spaceAfter=0,
        ),
        "table": ParagraphStyle(
            "table",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.7,
            leading=11,
            textColor=TEXT,
        ),
        "table_head": ParagraphStyle(
            "table_head",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.8,
            leading=11,
            textColor=colors.white,
        ),
    }


def p(text, style):
    return Paragraph(text, style)


def bullets(items, style):
    return [p(f"- {item}", style) for item in items]


def section(title, paragraphs, style):
    story = [p(title, style["h1"])]
    for text in paragraphs:
        story.append(p(text, style["body"]))
    return story


def payment_table(style):
    data = [
        [p("Item", style["table_head"]), p("Amount / Timing", style["table_head"])],
        [p("Total project price", style["table"]), p("$7,000", style["table"])],
        [p("Deposit to begin", style["table"]), p("$3,500 due before full build starts", style["table"])],
        [p("Final payment", style["table"]), p("$3,500 due before launch / activation", style["table"])],
    ]
    table = Table(data, colWidths=[2.05 * inch, 4.25 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BRAND),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def two_col_table(headers, rows, style):
    data = [[p(headers[0], style["table_head"]), p(headers[1], style["table_head"])]]
    for left, right in rows:
        data.append([p(left, style["table"]), p(right, style["table"])])
    table = Table(data, colWidths=[2.35 * inch, 3.95 * inch], repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BRAND),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def build():
    style = styles()
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=LETTER,
        rightMargin=0.8 * inch,
        leftMargin=0.8 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.78 * inch,
        title="WorkFlowOS Client Kickoff and Discovery Phase",
        author="Symbiotic AI LLC",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="body")
    doc.addPageTemplates(
        [
            PageTemplate(id="cover", frames=[frame], onPage=cover),
            PageTemplate(id="content", frames=[frame], onPage=footer),
        ]
    )

    story = [NextPageTemplate("content"), PageBreak()]

    story += section(
        "Purpose",
        [
            "This document explains what happens when a customer approves the WorkFlowOS project and is ready to move forward.",
            "The demo and phone notification shown during the introduction are part of the proof of concept. They demonstrate the direction of the platform: jobs, milestones, employee updates, inventory awareness, and owner notifications.",
        ],
        style,
    )

    story += [p("Project Offer", style["h1"])]
    story.append(
        p(
            "Symbiotic AI LLC will provide a customized licensed version of WorkFlowOS for the customer's internal business operations. The first project price is <b>$7,000</b>.",
            style["body"],
        )
    )
    story.append(
        p(
            "This price covers licensed platform setup, company workflow configuration, core app customization, employee roles, inventory tracking, milestone notifications, deployment setup, and basic onboarding.",
            style["body"],
        )
    )
    story.append(Spacer(1, 6))
    story.append(payment_table(style))

    story.append(Spacer(1, 8))
    story.append(
        Table(
            [[p("Deposit requirement: $3,500 is due before the full build begins. The remaining $3,500 is due before launch, activation, and final setup.", style["callout"])]],
            colWidths=[6.3 * inch],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF7ED")),
                    ("BOX", (0, 0), (-1, -1), 0.8, EMBER),
                    ("LEFTPADDING", (0, 0), (-1, -1), 11),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 11),
                    ("TOPPADDING", (0, 0), (-1, -1), 9),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                ]
            ),
        )
    )

    story += [p("What The $7,000 Includes", style["h1"])]
    story += bullets(
        [
            "Customized WorkFlowOS workspace setup",
            "Company workflow discovery and mapping",
            "Job, task, and milestone tracking",
            "Owner/admin, manager, and employee roles",
            "Simple inventory tracking: have, need, low, missing",
            "Owner and manager notification setup",
            "English and Spanish workflow support",
            "Basic deployment setup",
            "Main computer or selected device setup",
            "Basic onboarding/training session",
        ],
        style["bullet"],
    )

    story += [p("Discovery Phase", style["h1"])]
    story.append(
        p(
            "The first step after payment is a focused Discovery Phase. This protects both sides from building the wrong system or agreeing to vague requirements.",
            style["body"],
        )
    )
    story.append(
        two_col_table(
            ["Discovery Area", "What Gets Mapped"],
            [
                ("Roles and permissions", "Owner, manager, employee, and any special access rules."),
                ("Workflow stages", "Job stages, milestone names, status labels, approval points, and blocked-work rules."),
                ("Inventory", "Categories, locations, low-stock rules, missing-material process, and job links."),
                ("Notifications", "Who gets alerted, which events trigger alerts, and whether SMS or push is used."),
                ("Employee experience", "Simple English/Spanish wording, device usage, and daily employee actions."),
            ],
            style,
        )
    )

    story += [p("Estimated Timeline", style["h1"])]
    story.append(
        two_col_table(
            ["Phase", "Estimated Time"],
            [
                ("Discovery and workflow mapping", "2-4 business days"),
                ("Working MVP build", "14-21 business days"),
                ("Client review, adjustments, and launch setup", "5-10 business days"),
                ("Expected first version delivery", "About 21-30 days after deposit and receipt of required information"),
            ],
            style,
        )
    )

    story += [p("Included Core Features", style["h1"])]
    story += bullets(
        [
            "Secure login foundation",
            "Role-based user access",
            "Owner dashboard",
            "Manager dashboard",
            "Simple employee view",
            "Job creation and updates",
            "Task and subtask tracking",
            "Milestone changes",
            "Inventory have/need/missing view",
            "Owner notification when important updates happen",
            "English/Spanish labels and workflow copy",
        ],
        style["bullet"],
    )

    story += [p("Notifications", style["h1"])]
    story.append(
        p(
            "The system is designed so the owner can receive alerts when important events occur. Initial notifications may use SMS. Push notifications can be added as a future phase depending on deployment and device strategy.",
            style["body"],
        )
    )
    story += bullets(
        [
            "New job created",
            "Milestone changed",
            "Job blocked",
            "Inventory marked low or missing",
            "Job ready for review",
            "Job completed",
        ],
        style["bullet"],
    )

    story += [p("Licensing And Ownership", style["h1"])]
    story += section(
        "",
        [
            "Symbiotic AI LLC provides a customized licensed version of its business workflow platform.",
            "Customer receives the right to use the customized application for its internal business operations while the account is active and in good standing.",
            "Customer owns its business data, uploaded content, branding, product information, customer records, and images.",
            "Symbiotic AI LLC retains ownership of the underlying platform, source code, reusable modules, templates, architecture, developer tools, and governance technology.",
            "The platform may be customized with Customer's preferred name, branding, workflows, and content, but customization does not transfer ownership of the underlying software.",
        ],
        style,
    )[1:]

    story += [p("Hardware And Third-Party Costs", style["h1"])]
    story.append(
        p(
            "The $7,000 project price covers software setup, customization, deployment support, and onboarding. Physical hardware is not included unless specifically listed in writing.",
            style["body"],
        )
    )
    story.append(
        p(
            "Hardware may include tablets, phones, computers, barcode scanners, label printers, or other devices. Third-party service costs may include hosting, database services, SMS/phone notifications, email delivery, domains, and storage.",
            style["body"],
        )
    )

    story += [p("Not Included Unless Added In Writing", style["h1"])]
    story += bullets(
        [
            "Unlimited custom features",
            "Full accounting system",
            "Full customer portal",
            "Advanced reporting",
            "Barcode scanning",
            "Photo upload workflow",
            "Payment processing",
            "Multi-location enterprise features",
            "Lifetime support",
            "Ownership of the WorkFlowOS source code",
        ],
        style["bullet"],
    )

    story += [p("Launch And Setup", style["h1"])]
    story.append(
        p(
            "When the app is complete and the final payment is received, Symbiotic AI LLC will activate the customer's licensed workspace, complete setup on the selected company computer or device, and provide basic onboarding.",
            style["body"],
        )
    )

    story += [p("Recommended Ongoing Support", style["h1"])]
    story.append(
        p(
            "After launch, the customer should maintain an active support/license plan for hosting, monitoring, backups, maintenance, updates, and support. Recommended support options can be quoted separately.",
            style["body"],
        )
    )

    story += [p("Client Approval Steps", style["h1"])]
    story += bullets(
        [
            "Approve the project direction.",
            "Pay the $3,500 deposit.",
            "Schedule the Discovery Phase.",
            "Provide company workflow details.",
            "Begin the full build.",
        ],
        style["bullet"],
    )

    story.append(Spacer(1, 10))
    story.append(
        p(
            "This document is a project planning and business discussion document. Any final agreement should be reviewed before signing.",
            style["small"],
        )
    )

    doc.build(story)
    print(OUT)


if __name__ == "__main__":
    build()
