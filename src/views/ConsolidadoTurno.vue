<template>
    <div class="overflow-x-auto bg-white dark:bg-white p-6 rounded-lg shadow-md">
        <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
            <h1 class="text-xs font-bold uppercase tracking-widest">Consolidado por Turno</h1>
        </div>

        <form @submit.prevent="generarPDF">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                    <label for="fecha" class="block text-sm font-medium text-black">Fecha *</label>
                    <input type="date" v-model="fecha" id="fecha"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-4 mt-4">
                <button type="submit"
                    class="px-6 py-3 bg-[#ffc107] font-semibold text-black rounded-lg shadow-md hover:bg-[#e0a800] uppercase text-xs">
                    Generar PDF
                </button>
            </div>
        </form>

        <embed v-if="pdfUrl" :src="pdfUrl" type="application/pdf" class="mt-4" width="100%" height="600px" />
    </div>
</template>

<script>
import { ref } from "vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default {
    name: "ConsolidadoTurno",
    data() {
        return {
            terminal: "",
            turno: "",
            fecha: "",
            codigo: "001",
            nombreEmpresa: "GAMA OPERADORES DE COMBUSTIBLE SAC"
        };
    },
    methods: {
        handleInputTurno() {
            this.turno = this.turno.toString().slice(0, 1);

            let turnoNum = parseInt(this.turno, 10);

            if (isNaN(turnoNum) || turnoNum < 1 || turnoNum > 9) {
                this.turno = "";
            }
        },
    },
    setup() {
        const pdfUrl = ref(null);

        // **Generar PDF**
        const generarPDF = () => {
            /**Hoja en Horizontal */
            const doc = new jsPDF({ orientation: "landscape" });

            /**Titulo del Reporte */
            doc.setFontSize(12);
            const pageWidth = doc.internal.pageSize.width;
            const text = "CONSOLIDADO POR TURNOS";
            const textWidth = doc.getTextWidth(text);
            const xPosition = (pageWidth - textWidth) / 2;
            doc.text(text, xPosition, 20);

            /** Encabezado de 16 campos  */
            const columns = [
                "TURNO", "PUNTO DE VENTA", "VENDEDOR", "TOTAL VENTAS",
                "EFECTIVO SOLES", "TARJETA DE CRÉDITO", "YAPE/PLIN", "Otras formas de pago",
                "Ventas asociadas a anticipo", "VENTAS CRÉDITO", "Depósitos a Bóveda Soles", "Faltante/Sobrante Soles"
            ];

            const lados = [
                {
                    lado: "01", manguera: "1", inicial: 2239.9800, final: 2296.7100, galones: 56.7300, precio: 15.6000, total: 854.99
                },
                {
                    lado: "01", manguera: "2", inicial: 2003.0000, final: 2061.9000, galones: 58.9000, precio: 15.8000, total: 930.62
                },
                {
                    lado: "02", manguera: "1", inicial: 1051.5700, final: 1089.1000, galones: 37.5300, precio: 16.9500, total: 636.13
                },
            ];

            const diaContometro = [
                {
                    clave: "L01-M1-DB5", lado: "01", manguera: "1", lecturaini: 0, lecturafin: 0, precio: 0, galserafin: 0, valorserafin: 0,
                    gallecturabruto: 0, valorlecturabruto: 0, galcredito: 0, valorcredito: 0, galadelanto: 0, galcontado: 0, valorcontado: 0, descuento: 0,
                    netocontado: 0, promociones: 0, galndcontado: 0, valorndcontado: 0, valortarjetas: 0
                },
                {
                    clave: "L01-M2-REG", lado: "01", manguera: "2", lecturaini: 0, lecturafin: 0, precio: 0, galserafin: 0, valorserafin: 0,
                    gallecturabruto: 0, valorlecturabruto: 0, galcredito: 0, valorcredito: 0, galadelanto: 0, galcontado: 0, valorcontado: 0, descuento: 0,
                    netocontado: 0, promociones: 0, galndcontado: 0, valorndcontado: 0, valortarjetas: 0
                },
                {
                    clave: "L02-M1-DB5", lado: "02", manguera: "1", lecturaini: 0, lecturafin: 0, precio: 0, galserafin: 0, valorserafin: 0,
                    gallecturabruto: 0, valorlecturabruto: 0, galcredito: 0, valorcredito: 0, galadelanto: 0, galcontado: 0, valorcontado: 0, descuento: 0,
                    netocontado: 0, promociones: 0, galndcontado: 0, valorndcontado: 0, valortarjetas: 0
                },
            ];


            const filteredData = diaContometro.map(item => {
                const match = lados.find(f => f.lado === item.lado && f.manguera === item.manguera);

                return [
                    item.clave,
                    match ? match.inicial : item.lecturaini,       // Lectura Inicial
                    match ? match.final : item.lecturafin,         // Lectura Final
                    item.galserafin,
                    match ? match.galones : item.gallecturabruto,  // Despacho Bruto GLL
                    match ? match.precio : item.precio,           // Precio Totem
                    match ? match.total : item.valorlecturabruto, // Valorización Bruta PEN
                    item.galcredito,
                    item.valorcredito,
                    item.galadelanto,
                    item.descuento,
                    item.promociones,
                    item.galndcontado,
                    item.valorndcontado,
                    item.valorndcontado,
                    item.valortarjetas
                ];
            });

            console.log(filteredData);

            autoTable(doc, {
                head: [columns],
                body: filteredData,
                startY: 30,
                theme: "grid",
                tableWidth: "auto",
                margin: { left: 5, right: 5 },
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    halign: "center",
                    valign: "middle",
                    lineWidth: 0.2,
                    lineColor: [0, 0, 0],
                },
                headStyles: {
                    textColor: [0, 0, 0],
                    fontStyle: "bold",
                },
                bodyStyles: {
                    textColor: [0, 0, 0],
                },
                columnStyles: {
                    0: { fillColor: [255, 230, 204] },
                    1: { fillColor: [255, 230, 204] },
                    2: { fillColor: [255, 230, 204] },
                    3: { fillColor: [255, 230, 204] },
                    4: { fillColor: [204, 229, 255] },
                    5: { fillColor: [204, 229, 255] },
                    6: { fillColor: [204, 229, 255] },
                    7: { fillColor: [204, 229, 255] },
                    8: { fillColor: [201, 201, 255] },
                    9: { fillColor: [201, 201, 255] },
                    10: { fillColor: [204, 229, 255] },
                    11: { fillColor: [204, 229, 255] },
  
                },
                didParseCell: function (data) {
                    if (data.row.section === 'head') {
                        if (data.column.index < 4) {
                            data.cell.styles.fillColor = [255, 153, 102]; // Naranja oscuro para los primeros 7 encabezados
                        } else if  (data.column.index < 8) {
                            data.cell.styles.fillColor = [102, 178, 255]; // Azul más oscuro para el resto
                        }  else if  (data.column.index < 10) {
                            data.cell.styles.fillColor = [102, 100, 255]; // Azul más oscuro para el resto
                        }else {
                            data.cell.styles.fillColor = [45, 100, 255]; // Azul más oscuro para el resto
                        }
                    }
                }
            });

            const startY = doc.lastAutoTable.finalY + 10;
            const marginX1 = 5;   // Primera tabla a la izquierda
            const marginX2 = 75;  // Segunda tabla en el medio
            const marginX3 = 145; // Tercera tabla a la derecha

            // Función para generar una tabla con un título incluido
            const generarTabla = (doc, title, columns, data, marginX, color) => {
                autoTable(doc, {
                    startY: startY,
                    margin: { left: marginX },
                    head: [
                        [{ content: title, colSpan: columns.length, styles: { halign: "center", fillColor: color, fontStyle: "bold" } }],
                        columns
                    ],
                    body: data,
                    theme: "grid",
                    tableWidth: "wrap",
                    styles: {
                        fontSize: 8,
                        cellPadding: 2,
                        halign: "center",
                        valign: "middle",
                        lineWidth: 0.2,
                        lineColor: [0, 0, 0],
                    },
                    headStyles: {
                        textColor: [0, 0, 0],
                        fontStyle: "bold",
                        fillColor: color, // Color personalizado para cada tabla
                    },
                    bodyStyles: {
                        textColor: [0, 0, 0],
                    }
                });
            };

        


            pdfUrl.value = URL.createObjectURL(doc.output("blob"));
        };

        return { pdfUrl, generarPDF };
    }
};
</script>