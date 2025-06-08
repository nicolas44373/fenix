// types/facturaTypes.ts
export type FacturaItemType = {
  descripcion: string
  cantidad: number
  precio_unitario: number
}

export type DatosEmpresa = {
  razonSocial: string
  cuit: string
  domicilio: string
  condicionIva: string
  inicioActividades: string
  puntoVenta: string
}

export const DATOS_EMPRESA: DatosEmpresa = {
  razonSocial: "Rectificaciones Fenix",
  cuit: "20-99999999-9",
  domicilio: "Banda de Rio Sali",
  condicionIva: "Responsable Inscripto",
  inicioActividades: "01/01/2020",
  puntoVenta: "0001"
}

export const MONTO_MINIMO_DATOS_CLIENTE = 417288