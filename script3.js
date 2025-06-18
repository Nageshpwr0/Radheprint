function calculate() {
  const jobWidth = parseFloat(document.getElementById("jobWidth").value);
  const jobHeight = parseFloat(document.getElementById("jobHeight").value);
  const qty = parseInt(document.getElementById("qty").value);
  const gsm = parseFloat(document.getElementById("gsm").value);
  const rate = parseFloat(document.getElementById("rate").value);
  const userSelectedPrintingType =
    document.getElementById("printingType").value;
  let printingType = userSelectedPrintingType;

  const lamination =
    document.getElementById("lamination").options[
      document.getElementById("lamination").selectedIndex
    ].text;
  const laminationValue = document.getElementById("lamination").value;
  const dieType = parseFloat(document.getElementById("dieType").value);
  const punching = document.getElementById("punching").value;
  const fabrication =
    document.getElementById("fabrication").options[
      document.getElementById("fabrication").selectedIndex
    ].text;
  const fabricationValue = document.getElementById("fabrication").value;
  const fabricationN =
    document.getElementById("fabricationN").options[
      document.getElementById("fabricationN").selectedIndex
    ].text;
  const fabrication2Value = document.getElementById("fabricationN").value;

  // --- NEW: Read values from the new dropdown ---
  const additionalProcess =
    document.getElementById("additionalProcess").options[
      document.getElementById("additionalProcess").selectedIndex
    ].text;
  const additionalProcessValue =
    document.getElementById("additionalProcess").value;

  const fullSheets = [
    { width: 18, height: 25 },
    { width: 18, height: 23 },
    { width: 15, height: 20 },
    { width: 12, height: 23 },
    { width: 15, height: 25 },
    { width: 12, height: 25 },
    { width: 19, height: 25 },
    { width: 20, height: 29.5 },
    { width: 13, height: 26 },
    { width: 14, height: 26 },
  ];

  const bleed = 0.1378; // 3.5mm in inches
  const gripper = 0.7; // inches

  const adjustedWidth = jobWidth + bleed;
  const adjustedHeight = jobHeight + bleed;

  let bestFit = { ups: 0, sheet: null, totalWastageArea: Infinity };

  const totalJobAreaRequired = qty * adjustedWidth * adjustedHeight;

  fullSheets.forEach((sheet) => {
    const shortSide = Math.min(sheet.width, sheet.height);
    const longSide = Math.max(sheet.width, sheet.height);
    const usableShort = shortSide - gripper;
    const usableLong = longSide;
    const fitW1 = Math.floor(usableLong / adjustedWidth);
    const fitH1 = Math.floor(usableShort / adjustedHeight);
    const ups1 = fitW1 * fitH1;
    const fitW2 = Math.floor(usableLong / adjustedHeight);
    const fitH2 = Math.floor(usableShort / adjustedWidth);
    const ups2 = fitW2 * fitH2;
    const maxUps = Math.max(ups1, ups2);

    if (maxUps === 0) {
      return;
    }

    const sheetsNeededForThisOption = Math.ceil(qty / maxUps);
    const totalAreaUsedByThisSheetOption =
      sheetsNeededForThisOption * sheet.width * sheet.height;
    const currentTotalWastageArea =
      totalAreaUsedByThisSheetOption - totalJobAreaRequired;

    if (currentTotalWastageArea < bestFit.totalWastageArea) {
      bestFit = {
        ups: maxUps,
        sheet: sheet,
        totalWastageArea: currentTotalWastageArea,
      };
    }
  });

  if (!bestFit.sheet || bestFit.ups === 0) {
    document.getElementById("result").innerHTML =
      "<p>Error: Job size cannot fit on any available sheet with current bleed/gripper settings.</p>";
    return;
  } // --- ALERT LOGIC ---

  let idealPrintingTypeForAlert = "";
  if (bestFit.ups % 2 === 1) {
    idealPrintingTypeForAlert = "frontback";
  } else if (bestFit.ups % 4 !== 0 && bestFit.ups % 2 === 0) {
    idealPrintingTypeForAlert = "doublegripper";
  } else if (bestFit.ups % 2 === 0) {
    idealPrintingTypeForAlert = "selfback";
  }

  if (userSelectedPrintingType !== idealPrintingTypeForAlert) {
    let recommendedText = "";
    switch (idealPrintingTypeForAlert) {
      case "frontback":
        recommendedText = "FrontBack or OneSide";
        break;
      case "doublegripper":
        recommendedText = "Double Gripper";
        break;
      case "selfback":
        recommendedText = "Selfback";
        break;
      default:
        recommendedText = "Other or OK";
        break;
    }
    alert(
      `Warning: You selected '${userSelectedPrintingType}', but the recommended type is '${recommendedText}'.`
    );
  }

  const sheetsNeeded = Math.ceil(qty / bestFit.ups);

  let wastage = 0;
  if (sheetsNeeded <= 1500) wastage = 100;
  else if (sheetsNeeded <= 3000) wastage = 150;
  else if (sheetsNeeded <= 6000) wastage = 200;
  else if (sheetsNeeded <= 9000) wastage = 300;
  else if (sheetsNeeded <= 14000) wastage = 350;
  else if (sheetsNeeded <= 50000) wastage = 400;
  else wastage = 600;

  const totalSheets = sheetsNeeded + wastage;
  let paperArea;
  switch (`${bestFit.sheet.width}x${bestFit.sheet.height}`) {
    case "13x26":
    case "14x26":
    case "15x25":
      paperArea = 400;
      break;
    case "19x25":
      paperArea = 600;
      break;
    case "20x29.5":
      paperArea = 20 * 29.5;
      break;
    default:
      paperArea = bestFit.sheet.width * bestFit.sheet.height;
      break;
  }

  const perSheetWeight = (paperArea * gsm) / (3100 * 500);
  const totalPaperWeight = perSheetWeight * totalSheets;
  const paperCost = totalPaperWeight * rate;

  let printingCost = 0;
  const rounds = Math.ceil(sheetsNeeded / 1000);
  const sheetsNeeded2 = sheetsNeeded * 2;
  const rounds2 = Math.ceil(sheetsNeeded2 / 1000);

  if (bestFit.sheet.width === 20 && bestFit.sheet.height === 29.5) {
    switch (printingType) {
      case "selfback":
      case "doublegripper":
        printingCost = rounds2 * 1 * 500 + (2700 - 500);
        break;
      case "frontback":
        printingCost = (rounds * 500 + 2200) * 2;
        break;
      case "oneside":
        printingCost = rounds * 500 + 2200;
        break;
    }
  } else {
    switch (printingType) {
      case "selfback":
      case "doublegripper":
        printingCost = rounds2 * 1 * 400 + 1600;
        break;
      case "frontback":
        printingCost = (rounds * 400 + 1600) * 2;
        break;
      case "oneside":
        printingCost = rounds * 400 + 1600;
        break;
      case "selfback1":
      case "doublegripper1":
        printingCost = rounds2 * 1 * 150 + 600;
        break;
      case "frontback1":
        printingCost = (rounds * 150 + 450) * 2;
        break;
      case "oneside1":
        printingCost = rounds * 150 + 450;
        break;
    }
  }

  let lamArea = bestFit.sheet.width * bestFit.sheet.height;
  let lamCost = 0;
  switch (laminationValue) {
    case "mattbs":
      lamCost = (lamArea * 0.90 * totalSheets) / 100;
      break;
    case "glossbs":
      lamCost = (lamArea * 0.84 * totalSheets) / 100;
      break;
    case "mattos":
      lamCost = (lamArea * 0.45 * totalSheets) / 100;
      break;
    case "glossos":
      lamCost = (lamArea * 0.42 * totalSheets) / 100;
      break;
    case "varnishbs":
      lamCost = (lamArea * 0.5 * totalSheets) / 100;
      break;
    case "varnishos":
      lamCost = (lamArea * 0.25 * totalSheets) / 100;
      break;
    case "thermattbs":
      lamCost = (lamArea * 1.80 * totalSheets) / 100;
      break;
    case "thermattos":
      lamCost = (lamArea * 0.85 * totalSheets) / 100;
      break;
    case "velmattbs":
      lamCost = (lamArea * 6 * totalSheets) / 100;
      break;
    case "velmattos":
      lamCost = (lamArea * 3 * totalSheets) / 100;
      break;
  }

  let punchCost = punching === "yes" ? Math.ceil(totalSheets / 1000) * 400 : 0;

  let fabricationCost = 0;
  const k = Math.ceil(qty / 1000);
  switch (fabricationValue) {
    case "singlefold":
      fabricationCost = k * 100;
      break;
    case "multifold":
      fabricationCost = k * 150;
      break;
    case "cardfolding":
      fabricationCost = k * 300;
      break;
    case "smallenv":
      fabricationCost = k * 400;
      break;
    case "bigenv":
      fabricationCost = k * 450;
      break;
    case "windowenv":
      fabricationCost = k * 500;
      break;
    case "bigwindowenv":
      fabricationCost = k * 550;
      break;
    case "a3gum3":
      fabricationCost = k * 600;
      break;
    case "a3gum2":
      fabricationCost = k * 450;
      break;
    case "a4gum2":
      fabricationCost = k * 400;
      break;
    case "threading":
      fabricationCost = k * 300;
      break;
    case "pouch":
      fabricationCost = k * 750;
      break;
    case "box":
      fabricationCost = k * 600;
      break;
    case "tentcard":
      fabricationCost = k * 400;
      break;
    case "wobler":
      fabricationCost = k * 1300;
      break;
    case "fullgumming":
      fabricationCost = (paperArea * 1.5 * totalSheets) / 100;
      break;
  }

  let fabricationCostN = 0;
  const k2 = Math.ceil(qty / 1000);
  switch (fabrication2Value) {
    case "singlefoldN":
      fabricationCostN = k2 * 100;
      break;
    case "multifoldN":
      fabricationCostN = k2 * 150;
      break;
    case "cardfoldingN":
      fabricationCostN = k2 * 300;
      break;
    case "smallenvN":
      fabricationCostN = k2 * 400;
      break;
    case "bigenvN":
      fabricationCostN = k2 * 450;
      break;
    case "windowenvN":
      fabricationCostN = k2 * 500;
      break;
    case "bigwindowenvN":
      fabricationCostN = k2 * 550;
      break;
    case "a3gum3N":
      fabricationCostN = k2 * 600;
      break;
    case "a3gum2N":
      fabricationCostN = k2 * 450;
      break;
    case "a4gum2N":
      fabricationCostN = k2 * 400;
      break;
    case "threadingN":
      fabricationCostN = k2 * 300;
      break;
    case "pouchN":
      fabricationCostN = k2 * 750;
      break;
    case "boxN":
      fabricationCostN = k2 * 600;
      break;
    case "tentcardN":
      fabricationCostN = k2 * 400;
      break;
    case "wobler":
      fabricationCostN = k2 * 1300;
      break;
    case "fullgummingN":
      fabricationCostN = (paperArea * 1.5 * totalSheets) / 100;
      break;
  }

  // --- NEW: Calculate cost for the additional process ---
  let additionalProcessCost = 0;
  const k3 = Math.ceil(sheetsNeeded / 1000);
  switch (additionalProcessValue) {
    case "spotuv":
      additionalProcessCost = k3 * 1500;
      break;
    case "raiseduv":
      additionalProcessCost = k3 * 2500;
      break;
    case "stampfoil":
      additionalProcessCost = k3 * 2000 + 2000;
      break;
    case "magicfoil":
      additionalProcessCost = k3 * 8000;
      break;
    case "spotuvbs":
      additionalProcessCost = k3 * 3000;
      break;
    case "raiseduvbs":
      additionalProcessCost = k3 * 5000;
      break;
    case "stampfoilbs":
      additionalProcessCost = k3 * 4000 + 4000;
      break;
    case "magicfoilbs":
      additionalProcessCost = k3 * 16000;
      break;
  }

  // --- UPDATED: Add new cost to the total ---
  const totalCost =
    paperCost +
    printingCost +
    lamCost +
    dieType +
    punchCost +
    fabricationCost +
    fabricationCostN +
    additionalProcessCost;
  const finalRate = totalCost / qty;

  // --- UPDATED: Add new details to the summary ---
  const summary = `
<h3>Job Summary</h3>
<p><strong>Qty:</strong> ${qty}</p>
<p><strong>Size:</strong> ${jobWidth}" x ${jobHeight}"</p>
<p><strong>Lamination:</strong> ${lamination}</p>
<p><strong>GSM:</strong> ${gsm}</p>
<p><strong>Printing:</strong> ${printingType}</p>
<p><strong>Punching:</strong> ${punching}</p>
<p><strong>Fabrication:</strong> ${fabrication}</p>
<p><strong>Fabrication 2:</strong> ${fabricationN}</p>
    <p><strong>Additional Process:</strong> ${additionalProcess}</p>

<hr>
<h3>Total Cost: ₹${totalCost.toFixed(2)}</h3>
<h3>Final Rate per Piece: ₹${finalRate.toFixed(2)}</h3>
<hr>
<p><strong>Best Fit:</strong> ${bestFit.ups} ups on ${
    bestFit.sheet.width
  }" x ${bestFit.sheet.height}"</p>
<p><strong>Total Sheets:</strong> ${totalSheets}</p>
<p><strong>Total Paper Weight:</strong> ${totalPaperWeight.toFixed(
    2
  )} kg</p>
<p><strong>Paper Cost:</strong> ₹${paperCost.toFixed(2)}</p>
<p><strong>Printing Cost:</strong> ₹${printingCost.toFixed(2)}</p>
<p><strong>Lamination/Varnish Cost:</strong> ₹${lamCost.toFixed(2)}</p>
<p><strong>Die Cost:</strong> ₹${dieType.toFixed(2)}</p>
<p><strong>Punching Cost:</strong> ₹${punchCost.toFixed(2)}</p>
<p><strong>Fabrication Cost:</strong> ₹${fabricationCost.toFixed(2)}</p>
<p><strong>Fabrication 2 Cost:</strong> ₹${fabricationCostN.toFixed(2)}</p>
    <p><strong>Additional Process Cost:</strong> ₹${additionalProcessCost.toFixed(
      2
    )}</p>
<hr>
`;

  document.getElementById("result").innerHTML = summary;
}
