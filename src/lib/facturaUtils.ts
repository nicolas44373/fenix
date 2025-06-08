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
}: {
  tipoFactura: 'B'
  numeroFactura: string
  fecha: string
  cliente: string
  items: FacturaItemType[]
  subtotal: number
  iva: number
  total: number
}) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Factura ${tipoFactura} ${numeroFactura}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; font-size: 12px; color: #333; }
    .container { max-width: 800px; margin: 0 auto; border: 1px solid #000; padding: 20px; background-color: #fff; }
    .header { display: flex; justify-content: space-between; margin-bottom: 20px; align-items: center; }
    .empresa h2 { font-size: 20px; margin-bottom: 4px; }
    .factura-info { text-align: right; }
    .tipo-factura {
      font-size: 40px;
      font-weight: bold;
      border: 3px solid #000;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 20px;
    }
    .datos-cliente, .totales { margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    table th, table td { border: 1px solid #000; padding: 6px; text-align: center; font-size: 11px; }
    table th { background-color: #f2f2f2; }
    .totales div { display: flex; justify-content: space-between; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="empresa">
        <h2>${DATOS_EMPRESA.razonSocial}</h2>
        <p>CUIT: ${DATOS_EMPRESA.cuit}</p>
        <p>Domicilio: ${DATOS_EMPRESA.domicilio}</p>
        <p>Condición IVA: ${DATOS_EMPRESA.condicionIva}</p>
      </div>
      <div class="factura-info">
        <div class="tipo-factura">${tipoFactura}</div>
        <p><strong>Factura ${tipoFactura}</strong></p>
        <p>Punto de Venta: ${DATOS_EMPRESA.puntoVenta}</p>
        <p>N°: ${numeroFactura}</p>
        <p>Fecha: ${fecha}</p>
      </div>
    </div>

    <div class="datos-cliente">
      <h3 style="margin-bottom: 8px;">Datos del Cliente</h3>
      <p><strong>Nombre:</strong> ${cliente}</p>
      <p><strong>Condición IVA:</strong> Consumidor Final</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Descripción</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map((item, idx) => {
            const totalItem = item.precio_unitario * item.cantidad
            return `
            <tr>
              <td>${String(idx + 1).padStart(3, '0')}</td>
              <td style="text-align: left;">${item.descripcion}</td>
              <td>${item.cantidad}</td>
              <td>${item.precio_unitario.toFixed(2)}</td>
              <td>${totalItem.toFixed(2)}</td>
            </tr>
          `
          })
          .join('')}
      </tbody>
    </table>

    <div class="totales" style="margin-top: 20px;">
      <div style="font-weight: bold; font-size: 14px;">
        <span>Total:</span><span>${total.toFixed(2)}</span>
      </div>
    </div>
  </div>
</body>
</html>`
}
