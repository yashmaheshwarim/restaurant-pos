export const printReceipt = async (content: string): Promise<boolean> => {
  try {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      throw new Error("Could not open print window")
    }

    // Create print content with VertexHub branding
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            @page {
              size: 80mm 297mm;  /* Roll Paper size */
              margin: 0;
            }
            body {
              font-family: 'Courier New', monospace;
              padding: 10px;
              width: 80mm;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
            }
            .content {
              font-size: 12px;
              line-height: 1.2;
            }
            .footer {
              text-align: center;
              margin-top: 10px;
              font-size: 10px;
            }
            pre {
              white-space: pre-wrap;
              margin: 0;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0;">Raghuvanshi Parotha House</h2>
            <p style="margin: 5px 0;">(Chotilawala)</p>
          </div>
          <div class="content">
            <pre>${content}</pre>
          </div>
          <div class="footer">
            <p>Thank you for dining with us!</p>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    await new Promise((resolve) => {
      printWindow.onafterprint = resolve
      printWindow.print()
    })

    printWindow.close()
    return true
  } catch (error) {
    console.error("Printing error:", error)
    return false
  }
}

