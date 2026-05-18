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
    return NextResponse.json(
      { error: "Load not found" },
      { status: 404 }
    );
  }

  const bol = load.documents[0]?.billOfLading;

  if (!bol) {
    return NextResponse.json(
      { error: "BOL not found" },
      { status: 404 }
    );
  }

  const pdfBuffer = await renderToBuffer(
    <BolPdf load={load} bol={bol} />
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${load.referenceNumber}-bol.pdf"`,
    },
  });
}

function BolPdf({
  load,
  bol,
}: {
  load: any;
  bol: any;
}) {
  const blankRows = Array.from({ length: 8 });
  const carrierRows = Array.from({ length: 9 });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBox}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerSmall}>Date:</Text>

            <Text style={styles.title}>
              BILL OF LADING
            </Text>

            <Text style={styles.headerSmall}>
              Page 1 of ____
            </Text>
          </View>

          {/* TOP SECTION */}
          <View style={styles.topGrid}>
            {/* LEFT */}
            <View style={styles.leftCol}>
              <SectionBar title="SHIP FROM" />

              <InfoBlock
                rows={[
                  ["Name:", bol.shipperName],
                  ["Address:", bol.shipperAddress],
                  [
                    "City/State/Zip:",
                    bol.shipperCityStateZip,
                  ],
                  ["SID#:", bol.sid],
                ]}
                fob
              />

              <SectionBar title="SHIP TO" />

              <InfoBlock
                rows={[
                  ["Name:", bol.consigneeName],
                  ["Address:", bol.consigneeAddress],
                  [
                    "City/State/Zip:",
                    bol.consigneeCityStateZip,
                  ],
                  ["CID#:", bol.cid],
                ]}
                extraTopRight={`Location #: ${
                  bol.locationNumber || "________"
                }`}
                fob
              />

              <SectionBar title="THIRD PARTY FREIGHT CHARGES BILL TO:" />

              <InfoBlock
                rows={[
                  ["Name:", bol.thirdPartyName],
                  ["Address:", bol.thirdPartyAddress],
                  [
                    "City/State/Zip:",
                    bol.thirdPartyCityStateZip,
                  ],
                ]}
              />

              <View style={styles.instructions}>
                <Text>SPECIAL INSTRUCTIONS:</Text>

                <Text>
                  {bol.specialInstructions || ""}
                </Text>
              </View>
            </View>

            {/* RIGHT */}
            <View style={styles.rightCol}>
              <View style={styles.bolNumberBox}>
                <Text style={styles.bold}>
                  Bill of Lading Number:{" "}
                  {bol.bolNumber ||
                    load.referenceNumber}
                </Text>

                <Text style={styles.barcode}>
                  BAR CODE SPACE
                </Text>
              </View>

              <View style={styles.carrierBox}>
                <Text style={styles.bold}>
                  CARRIER NAME:{" "}
                  {bol.carrierName ||
                    "________________"}
                </Text>

                <Text>
                  Trailer number:{" "}
                  {bol.trailerNumber || ""}
                </Text>

                <Text>
                  Seal number(s):{" "}
                  {bol.sealNumber || ""}
                </Text>
              </View>

              <View style={styles.carrierBox}>
                <Text style={styles.bold}>
                  SCAC: {bol.scac || ""}
                </Text>

                <Text style={styles.bold}>
                  Pro number:{" "}
                  {bol.proNumber || ""}
                </Text>

                <Text style={styles.barcode}>
                  BAR CODE SPACE
                </Text>
              </View>

              <View style={styles.freightTerms}>
                <Text style={styles.bold}>
                  Freight Charge Terms:{" "}
                  <Text style={styles.italic}>
                    freight charges are prepaid
                    unless marked otherwise
                  </Text>
                </Text>

                <View style={styles.row}>
                  <Text>Prepaid ______</Text>

                  <Text>Collect ______</Text>

                  <Text>3rd Party ______</Text>
                </View>

                <Text style={styles.smallText}>
                  ☐ Master Bill of Lading:
                  with attached underlying Bills
                  of Lading
                </Text>
              </View>
            </View>
          </View>

          {/* CUSTOMER ORDER INFO */}
          <SectionBar title="CUSTOMER ORDER INFORMATION" />

          <View style={styles.customerHeader}>
            <Cell flex={3} bold>
              CUSTOMER ORDER NUMBER
            </Cell>

            <Cell flex={1} bold>
              # PKGS
            </Cell>

            <Cell flex={1} bold>
              WEIGHT
            </Cell>

            <Cell flex={1.3} bold>
              PALLET/SLIP
            </Cell>

            <Cell flex={4} bold>
              ADDITIONAL SHIPPER INFO
            </Cell>
          </View>

          {blankRows.map((_, i) => (
            <View
              key={i}
              style={styles.tableRow}
            >
              <Cell flex={3}>
                {i === 0
                  ? bol.customerOrderNumber ||
                    ""
                  : ""}
              </Cell>

              <Cell flex={1}>
                {i === 0
                  ? bol.pieces || ""
                  : ""}
              </Cell>

              <Cell flex={1}>
                {i === 0
                  ? bol.weight ||
                    load.weight ||
                    ""
                  : ""}
              </Cell>

              <Cell flex={1.3}>
                Y     N
              </Cell>

              <Cell flex={4}>
                {i === 0
                  ? bol.additionalShipperInfo ||
                    ""
                  : ""}
              </Cell>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.bold}>
              GRAND TOTAL
            </Text>
          </View>

          {/* CARRIER INFORMATION */}
          <SectionBar title="CARRIER INFORMATION" />

          <View style={styles.carrierHeader}>
            <Cell flex={1.1} bold>
              HANDLING UNIT{"\n"}QTY
            </Cell>

            <Cell flex={1.1} bold>
              TYPE
            </Cell>

            <Cell flex={1.1} bold>
              PACKAGE{"\n"}QTY
            </Cell>

            <Cell flex={1.1} bold>
              TYPE
            </Cell>

            <Cell flex={1.4} bold>
              WEIGHT
            </Cell>

            <Cell flex={0.9} bold>
              H.M.{"\n"}(X)
            </Cell>

            <Cell flex={4.5} bold>
              COMMODITY DESCRIPTION
            </Cell>

            <Cell flex={1.4} bold>
              NMFC #
            </Cell>

            <Cell flex={1.2} bold>
              CLASS
            </Cell>
          </View>

          {carrierRows.map((_, i) => (
            <View
              key={i}
              style={styles.tableRow}
            >
              <Cell flex={1.1}>
                {i === 0
                  ? bol.handlingQty || ""
                  : ""}
              </Cell>

              <Cell flex={1.1}>
                {i === 0
                  ? bol.handlingType || ""
                  : ""}
              </Cell>

              <Cell flex={1.1}>
                {i === 0
                  ? bol.pieces || ""
                  : ""}
              </Cell>

              <Cell flex={1.1}>
                {i === 0
                  ? bol.packageType || ""
                  : ""}
              </Cell>

              <Cell flex={1.4}>
                {i === 0
                  ? bol.weight ||
                    load.weight ||
                    ""
                  : ""}
              </Cell>

              <Cell flex={0.9}>
                {i === 0 &&
                bol.hazardous
                  ? "X"
                  : ""}
              </Cell>

              <Cell flex={4.5}>
                {i === 0
                  ? bol.commodity ||
                    load.commodity ||
                    "General Freight"
                  : ""}
              </Cell>

              <Cell flex={1.4}>
                {i === 0
                  ? bol.nmfc || ""
                  : ""}
              </Cell>

              <Cell flex={1.2}>
                {i === 0
                  ? bol.class || ""
                  : ""}
              </Cell>
            </View>
          ))}

          <View style={styles.bottomTotal}>
            <Text style={styles.bold}>
              GRAND TOTAL
            </Text>
          </View>

          {/* COD */}
          <View style={styles.codRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tinyText}>
                Where the rate is dependent
                on value, shippers are
                required to state
                specifically in writing the
                agreed or declared value of
                the property.
              </Text>

              <Text style={styles.tinyText}>
                The agreed or declared
                value of the property is
                specifically stated by the
                shipper to be not exceeding
                __________ per __________.
              </Text>
            </View>

            <View style={styles.codBox}>
              <Text style={styles.bold}>
                COD Amount: $
                __________________
              </Text>

              <Text>
                Fee Terms: Collect: ☐
                Prepaid: ☐
              </Text>

              <Text>
                Customer check acceptable:
                ☐
              </Text>
            </View>
          </View>

          {/* NOTE */}
          <View style={styles.noteRow}>
            <Text style={styles.bold}>
              NOTE Liability Limitation
              for loss or damage in this
              shipment may be applicable.
            </Text>
          </View>

          {/* SIGNATURES */}
          <View style={styles.signatureGrid}>
            <View style={styles.signatureBox}>
              <Text style={styles.bold}>
                SHIPPER SIGNATURE / DATE
              </Text>

              <Text style={styles.tinyText}>
                This is to certify that
                the above named materials
                are properly classified,
                packaged, marked and
                labeled, and are in proper
                condition for
                transportation.
              </Text>
            </View>

            <View style={styles.signatureBox}>
              <Text>
                Trailer Loaded:
              </Text>

              <Text>
                ☐ By Shipper
              </Text>

              <Text>
                ☐ By Driver
              </Text>
            </View>

            <View style={styles.signatureBox}>
              <Text>
                Freight Counted:
              </Text>

              <Text>
                ☐ By Shipper
              </Text>

              <Text>
                ☐ By Driver/pallets said
                to contain
              </Text>

              <Text>
                ☐ By Driver/Pieces
              </Text>
            </View>

            <View style={styles.signatureBox}>
              <Text style={styles.bold}>
                CARRIER SIGNATURE /
                PICKUP DATE
              </Text>

              <Text style={styles.tinyText}>
                Carrier acknowledges
                receipt of packages and
                required placards.
                Property described above
                is received in good order,
                except as noted.
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function SectionBar({
  title,
}: {
  title: string;
}) {
  return (
    <View style={styles.sectionBar}>
      <Text>{title}</Text>
    </View>
  );
}

function InfoBlock({
  rows,
  fob,
  extraTopRight,
}: {
  rows: [string, any][];
  fob?: boolean;
  extraTopRight?: string;
}) {
  return (
    <View style={styles.infoBlock}>
      {extraTopRight && (
        <Text style={styles.extraRight}>
          {extraTopRight}
        </Text>
      )}

      {rows.map(([label, value]) => (
        <Text key={label}>
          {label} {value || ""}
        </Text>
      ))}

      {fob && (
        <Text style={styles.fob}>
          FOB: ☐
        </Text>
      )}
    </View>
  );
}

function Cell({
  children,
  flex = 1,
  bold = false,
}: {
  children?: React.ReactNode;
  flex?: number;
  bold?: boolean;
}) {
  return (
    <View
      style={[styles.cell, { flex }]}
    >
      <Text
        style={
          bold ? styles.bold : undefined
        }
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 14,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#000",
  },

  outerBox: {
    borderWidth: 1,
    borderColor: "#000",
  },

  header: {
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  headerSmall: {
    flex: 1,
    paddingHorizontal: 4,
    fontSize: 9,
  },

  title: {
    flex: 2,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  topGrid: {
    flexDirection: "row",
  },

  leftCol: {
    flex: 1.35,
    borderRightWidth: 1,
    borderColor: "#000",
  },

  rightCol: {
    flex: 1,
  },

  sectionBar: {
    backgroundColor: "#000",
    color: "#fff",
    textAlign: "center",
    fontSize: 8,
    fontWeight: "bold",
    paddingVertical: 2,
  },

  infoBlock: {
    minHeight: 58,
    padding: 4,
    position: "relative",
  },

  extraRight: {
    position: "absolute",
    right: 4,
    top: 4,
  },

  fob: {
    position: "absolute",
    right: 4,
    bottom: 4,
  },

  instructions: {
    height: 42,
    padding: 4,
    borderTopWidth: 1,
    borderColor: "#000",
  },

  bolNumberBox: {
    height: 78,
    padding: 6,
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  barcode: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    color: "#B0B0B0",
    letterSpacing: 4,
    fontWeight: "bold",
  },

  carrierBox: {
    minHeight: 45,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  freightTerms: {
    minHeight: 54,
    padding: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  customerHeader: {
    flexDirection: "row",
    minHeight: 18,
  },

  carrierHeader: {
    flexDirection: "row",
    minHeight: 28,
  },

  tableRow: {
    flexDirection: "row",
    minHeight: 17,
  },

  cell: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3,
    justifyContent: "center",
    textAlign: "center",
  },

  totalRow: {
    height: 18,
    borderTopWidth: 1,
    borderColor: "#000",
    padding: 4,
  },

  bottomTotal: {
    height: 20,
    borderTopWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  codRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#000",
  },

  codBox: {
    width: 230,
    padding: 5,
    borderLeftWidth: 2,
    borderColor: "#000",
  },

  noteRow: {
    padding: 4,
    borderTopWidth: 1,
    borderColor: "#000",
  },

  signatureGrid: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#000",
    minHeight: 58,
  },

  signatureBox: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#000",
  },

  bold: {
    fontWeight: "bold",
  },

  italic: {
    fontStyle: "italic",
  },

  smallText: {
    fontSize: 7,
    marginTop: 5,
  },

  tinyText: {
    fontSize: 6,
    lineHeight: 1.25,
  },
});