// lib/facturaUtils.ts
import { FacturaItemType, DATOS_EMPRESA } from '@/types/facturaTypes'

export const generarNumeroFactura = () =>
  `${DATOS_EMPRESA.puntoVenta}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(8, '0')}`

export const generarFacturaHTML = ({
  tipoFactura,
  numeroFactura,
  fecha,
  cliente,
  items,
  subtotal,
  iva,
  total,
  tipoDocumento = 'factura',
}: {
  tipoFactura: 'B'
  numeroFactura: string
  fecha: string
  cliente: string
  items: FacturaItemType[]
  subtotal: number
  iva: number
  total: number
  tipoDocumento?: 'factura' | 'presupuesto'
}) => {
  const titulo = tipoDocumento === 'presupuesto' ? 'PRESUPUESTO' : `FACTURA ${tipoFactura}`
  const codigoLetra = tipoFactura
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${titulo} ${numeroFactura}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      color: #000;
      font-size: 11px;
      line-height: 1.2;
      margin: 0;
      padding: 10mm;
    }
    .container {
      width: 190mm;
      margin: 0 auto;
      padding: 10mm;
      border: 1px solid #000;
      background: white;
      box-sizing: border-box;
    }
    .header-top {
      border-bottom: 2px solid #000;
      text-align: center;
      padding: 6px 0;
      font-weight: bold;
      font-size: 12px;
    }
    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #000;
    }
    .logo-img {
      max-height: 60px;
      object-fit: contain;
      margin-right: 10px;
    }
    .box-letter {
      border: 2px solid #000;
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      flex-shrink: 0;
    }
    .box-letter .code {
      font-size: 7px;
      margin-top: 2px;
    }
    .invoice-title {
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      flex-grow: 1;
      margin: 0 10px;
    }
    .header-info {
      text-align: right;
      font-size: 10px;
      flex-shrink: 0;
      min-width: 160px;
    }
    .header-info p {
      margin: 2px 0;
    }
    .company-section {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #000;
    }
    .company-left, .company-right {
      width: 48%;
    }
    .company-left p, .company-right p {
      margin: 2px 0;
      font-size: 10px;
    }
    .period-section {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #000;
      padding: 8px 0;
      font-size: 10px;
    }
    .client-section {
      border-bottom: 2px solid #000;
      padding: 10px 0;
      font-size: 10px;
    }
    .client-section p {
      margin: 2px 0;
    }
    .detail-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 10px;
    }
    .detail-table th, .detail-table td {
      border: 1px solid #000;
      padding: 6px 4px;
      text-align: center;
      vertical-align: middle;
    }
    .detail-table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .detail-table td:nth-child(2) {
      text-align: left;
    }
    .detail-table td:nth-child(5),
    .detail-table td:nth-child(6),
    .detail-table td:nth-child(7) {
      text-align: right;
    }
    .totals-section {
      margin-top: 10px;
      border-top: 1px solid #000;
      padding-top: 6px;
    }
    .totals {
      display: flex;
      justify-content: flex-end;
      margin: 4px 0;
      font-size: 11px;
    }
    .totals .label {
      width: 100px;
      text-align: right;
      margin-right: 8px;
      font-weight: bold;
    }
    .totals .value {
      width: 70px;
      text-align: right;
      border-bottom: 1px solid #000;
      padding-bottom: 2px;
    }
    .total-final {
      font-weight: bold;
      font-size: 12px;
      border-bottom: 2px solid #000 !important;
    }
    .footer {
      margin-top: 20px;
      font-size: 9px;
      text-align: center;
      border-top: 1px solid #000;
      padding-top: 10px;
      position: absolute;
      bottom: 10mm;
      left: 10mm;
      right: 10mm;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-top">ORIGINAL</div>
    <div class="header-main">
      <img src="/fenix.png" alt="Logo Fenix" class="logo-img" />
      
      <div class="invoice-title">${titulo}</div>
      <div class="header-info">
        <p><strong>Punto de Venta:</strong> ${DATOS_EMPRESA.puntoVenta}</p>
        <p><strong>Comp. Nro.:</strong> ${numeroFactura}</p>
        <p><strong>Fecha de Emisión:</strong> ${fecha}</p>
      </div>
    </div>
    <div class="company-section">
      <div class="company-left">
        <p><strong>Razón Social:</strong> ${DATOS_EMPRESA.razonSocial}</p>
        <p><strong>Domicilio Comercial:</strong> ${DATOS_EMPRESA.domicilio}</p>
        <p><strong>Condición frente al IVA:</strong> ${DATOS_EMPRESA.condicionIva}</p>
      </div>
      <div class="company-right">
        <p><strong>CUIT:</strong> ${DATOS_EMPRESA.cuit}</p>
      </div>
    </div>
    <div class="period-section">
      <div><p><strong>Periodo Facturado Desde:</strong> --/--/----</p></div>
      <div><p><strong>Fecha de Vto. para el pago:</strong> --/--/----</p></div>
    </div>
    <div class="client-section">
      <p><strong>Apellidos y Nombre / Razón Social:</strong> ${cliente}</p>
      <p><strong>Domicilio:</strong> -</p>
      <p><strong>Condición frente al IVA:</strong> Consumidor Final</p>
    </div>
    <table class="detail-table">
      <thead>
        <tr>
          <th style="width: 60px;">Código</th>
          <th style="width: 300px;">Producto / Servicio</th>
          <th style="width: 80px;">Cantidad</th>
          <th style="width: 80px;">U. Medida</th>
          <th style="width: 100px;">Precio Unit.</th>
          <th style="width: 80px;">Imp. Bonif.</th>
          <th style="width: 100px;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item, idx) => {
          const totalItem = item.precio_unitario * item.cantidad
          return `
            <tr>
              <td>${String(idx + 1).padStart(3, '0')}</td>
              <td style="text-align: left;">${item.descripcion}</td>
              <td>${item.cantidad.toFixed(2)}</td>
              <td>un</td>
              <td>$ ${item.precio_unitario.toFixed(2)}</td>
              <td>$ 0,00</td>
              <td>$ ${totalItem.toFixed(2)}</td>
            </tr>`
        }).join('')}
      </tbody>
    </table>
    <div class="totals-section">
      <div class="totals">
        <div class="label">Subtotal:</div>
        <div class="value">$ ${subtotal.toFixed(2)}</div>
      </div>
      <div class="totals">
        <div class="label">IVA:</div>
        <div class="value">$ ${iva.toFixed(2)}</div>
      </div>
      <div class="totals total-final">
        <div class="label">Importe Total:</div>
        <div class="value">$ ${total.toFixed(2)}</div>
      </div>
    </div>
    <div class="footer">
      <p>Comprobante Autorizado - CAE N°: _____________ Fecha de Vto. de CAE: --/--/----</p>
      <p>Generado por Sistema Fenix</p>
    </div>
  </div>
</body>
</html>`
}
