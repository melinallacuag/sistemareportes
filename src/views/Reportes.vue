<template>
  <div class="bg-white dark:bg-white p-4 rounded-lg shadow-md w-full overflow-x-auto">
    <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
      <h1 class="text-xs font-bold uppercase tracking-widest">Reportes</h1>
    </div>
    <!-- <embed :src="pdfUrl" type="application/pdf" width="100%" height="600px" />-->

    <button @click="generarPDF">Generar PDF</button>
    <embed v-if="pdfUrl" :src="pdfUrl" type="application/pdf" width="100%" height="600px" />
  </div>
</template>

<script>
import { ref } from "vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default {
  name: "ReporteVentas",
  setup() {
    const pdfUrl = ref(null);

    // 📌 **Datos de prueba (Incluyendo el vendedor)**
    const ventasCombustible = [
      { vendedor: "Luis", cliente: "LUZ MARIA M P", producto: "D2 PET", cantidad: 55.54, total: 1044.37 },
      { vendedor: "Luis", cliente: "LUZ MARIA M P", producto: "PREMIUM", cantidad: 13.08, total: 258.96 },
      { vendedor: "Carlos", cliente: "JOSUE R E", producto: "D2 PET", cantidad: 70.26, total: 1318.15 },
      { vendedor: "Carlos", cliente: "JOSUE R E", producto: "PREMIUM", cantidad: 2.18, total: 45.00 }
    ];

    const ventasProductos = [
      { vendedor: "Luis", cliente: "LUZ MARIA M P", producto: "Aceite", cantidad: 2, total: 100.00 },
      { vendedor: "Carlos", cliente: "JOSUE R E", producto: "Lubricante", cantidad: 3, total: 150.00 }
    ];

    const notasDespacho = [
      { vendedor: "Luis", cliente: "LUZ MARIA M P", documento: "Factura 001", monto: 3000.00 },
      { vendedor: "Carlos", cliente: "JOSUE R E", documento: "Boleta 002", monto: 2159.78 }
    ];

    const ventasTarjetas = [
      { vendedor: "Luis", cliente: "LUZ MARIA M P", tarjeta: "VISA", monto: 100.00 },
      { vendedor: "Carlos", cliente: "JOSUE R E", tarjeta: "MASTERCARD", monto: 45.00 }
    ];

    // **Agrupar por Vendedor**
    const agruparPorVendedor = () => {
      const agrupado = {};

      [...ventasCombustible, ...ventasProductos].forEach((venta) => {
        if (!agrupado[venta.vendedor]) {
          agrupado[venta.vendedor] = { ventas: [], productos: [], notas: [], tarjetas: [], totalVentas: 0 };
        }
        if (ventasCombustible.includes(venta)) {
          agrupado[venta.vendedor].ventas.push(venta);
        } else {
          agrupado[venta.vendedor].productos.push(venta);
        }
        agrupado[venta.vendedor].totalVentas += venta.total;
      });

      notasDespacho.forEach((nota) => {
        if (!agrupado[nota.vendedor]) {
          agrupado[nota.vendedor] = { ventas: [], productos: [], notas: [], tarjetas: [], totalVentas: 0 };
        }
        agrupado[nota.vendedor].notas.push(nota);
      });

      ventasTarjetas.forEach((tarjeta) => {
        if (!agrupado[tarjeta.vendedor]) {
          agrupado[tarjeta.vendedor] = { ventas: [], productos: [], notas: [], tarjetas: [], totalVentas: 0 };
        }
        agrupado[tarjeta.vendedor].tarjetas.push(tarjeta);
      });

      return agrupado;
    };

    // **Generar PDF**
    const generarPDF = () => {
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text("Reporte de Ventas por Vendedor", 10, 20);

      const vendedoresAgrupados = agruparPorVendedor();
      let yPos = 30; // Posición inicial en el PDF

      // 🔹 **Recorrer vendedores**
      Object.keys(vendedoresAgrupados).forEach((vendedor) => {
        doc.setFontSize(12);
        doc.text(`Trabajador: ${vendedor}`, 10, yPos);
        yPos += 10;

        // 📌 **Tabla de Ventas de Combustible**
        if (vendedoresAgrupados[vendedor].ventas.length > 0) {
          doc.setFontSize(12);
          doc.text("Detalle de Venta de Combustibles", 14, yPos);
          yPos += 2;
          const ventasData = vendedoresAgrupados[vendedor].ventas.map((v) => [
            v.cliente,
            v.producto,
            v.cantidad,
            `S/. ${v.total.toFixed(2)}`
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [["Cliente", "Producto", "Cantidad", "Total"]],
            body: ventasData,
            theme: "striped",
            styles: { halign: "center" }
          });

          yPos = doc.lastAutoTable.finalY + 10;
        }

        // 📌 **Tabla de Ventas de Otros Productos**
        if (vendedoresAgrupados[vendedor].productos.length > 0) {
          doc.setFontSize(12);
          doc.text("Detalle de Venta de Tienda", 14, yPos);
          yPos += 2;
          const productosData = vendedoresAgrupados[vendedor].productos.map((p) => [
            p.cliente,
            p.producto,
            p.cantidad,
            `S/. ${p.total.toFixed(2)}`
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [["Cliente", "Producto", "Cantidad", "Total"]],
            body: productosData,
            theme: "grid",
            styles: { halign: "center" }
          });

          yPos = doc.lastAutoTable.finalY + 10;
        }

        // 📌 **Total Ventas por Vendedor**
        autoTable(doc, {
          startY: yPos,
          body: [["","", "TOTAL VENTAS VENDEDOR", `S/. ${vendedoresAgrupados[vendedor].totalVentas.toFixed(2)}`]],
          theme: "striped",
          styles: { halign: "center" },
          columnStyles: { 2: { fontStyle: "bold" }, 3: { fontStyle: "bold" } }
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // 📌 **Tabla de Notas de Despacho**
        if (vendedoresAgrupados[vendedor].notas.length > 0) {
          doc.setFontSize(12);
          doc.text("Detalle de Nota de Despacho", 14, yPos);
          yPos += 2;
          const notasData = vendedoresAgrupados[vendedor].notas.map((n) => [
            n.cliente,
            n.documento,
            `S/. ${n.monto.toFixed(2)}`
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [["Cliente", "Documento", "Monto"]],
            body: notasData,
            theme: "grid",
            styles: { halign: "center" }
          });

          yPos = doc.lastAutoTable.finalY + 10;
        }

        // 📌 **Tabla de Tarjetas**
        if (vendedoresAgrupados[vendedor].tarjetas.length > 0) {
          doc.setFontSize(12);
          doc.text("Detalles de Tarjeta de Creditos", 14, yPos);
          yPos += 2;
          const tarjetasData = vendedoresAgrupados[vendedor].tarjetas.map((t) => [
            t.cliente,
            t.tarjeta,
            `S/. ${t.monto.toFixed(2)}`
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [["Cliente", "Tarjeta", "Monto"]],
            body: tarjetasData,
            theme: "grid",
            styles: { halign: "center" }
          });

          yPos = doc.lastAutoTable.finalY + 10;
        }

      });

      // 📌 **Total General**
      const totalGeneral = Object.values(vendedoresAgrupados).reduce((acc, c) => acc + c.totalVentas, 0);
      autoTable(doc, {
        startY: yPos,
        body: [["","", "TOTAL GENERAL", `S/. ${totalGeneral.toFixed(2)}`]],
        theme: "striped",
        styles: { halign: "center" },
        columnStyles: { 
        2: { fontStyle: "bold", fillColor: [75,75,75], textColor: [255, 255, 255] }, // Rojo con texto blanco
        3: { fontStyle: "bold", fillColor: [75,75,75], textColor: [255, 255, 255] }  // Rojo con texto blanco
    }
      });

      pdfUrl.value = URL.createObjectURL(doc.output("blob"));
    };

    return { pdfUrl, generarPDF };
  }
};
</script>