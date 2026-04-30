import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const load = await prisma.load.findUnique({
    where: { id },
    include: {
      documents: {
        where: {
          type: "BILL_OF_LADING",
        },
        include: {
          billOfLading: true,
        },
      },
    },
  });

  if (!load) {
    return NextResponse.json({ error: "Load not found" }, { status: 404 });
  }

  const bol = load.documents[0]?.billOfLading;

  if (!bol) {
    return NextResponse.json({ error: "BOL not found" }, { status: 404 });
  }

const pdfBuffer = await renderToBuffer(<BolPdf load={load} bol={bol} />);

return new NextResponse(new Uint8Array(pdfBuffer), {
  status: 200,
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="${load.referenceNumber}-bol.pdf"`,
  },
});
}

function BolPdf({ load, bol }: { load: any; bol: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Bill of Lading</Text>

        <View style={styles.topRow}>
          <Text>Load #: {load.referenceNumber}</Text>
          <Text>Status: {load.status}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Shipper</Text>
          <Text>Name: {bol.shipperName}</Text>
          <Text>Address: {bol.shipperAddress}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Consignee</Text>
          <Text>Name: {bol.consigneeName}</Text>
          <Text>Address: {bol.consigneeAddress}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Carrier</Text>
          <Text>Carrier: {bol.carrierName || "-"}</Text>
          <Text>Trailer #: {bol.trailerNumber || "-"}</Text>
          <Text>Seal #: {bol.sealNumber || "-"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Freight Details</Text>
          <Text>
            Commodity: {bol.commodity || load.commodity || "General Freight"}
          </Text>
          <Text>Weight: {bol.weight || load.weight || "-"} lbs</Text>
          <Text>Pieces: {bol.pieces || "-"}</Text>
        </View>

        <View style={styles.signatures}>
          <Text>Driver Signature: __________________________</Text>
          <Text>Receiver Signature: ________________________</Text>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
  },
  section: {
    marginBottom: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  heading: {
    fontSize: 13,
    marginBottom: 8,
  },
  signatures: {
    marginTop: 40,
    gap: 18,
  },
});