// Helper: parse inches and mm for jobWidth/jobHeight
function parseInputToInches(input) {
  input = input.trim().toLowerCase();
  if (input.endsWith('mm')) {
    let mmValue = parseFloat(input.replace('mm', ''));
    if (!isNaN(mmValue)) {
      return mmValue / 25.4; // convert mm to inches
    }
  }
  // Default: treat as inches
  let inchValue = parseFloat(input);
  return isNaN(inchValue) ? 0 : inchValue;
}

// GSM validation and PaperType filtering
function filterPaperTypeOptions() {
  const gsmInput = document.getElementById("gsm");
  const gsm = parseFloat(gsmInput.value);
  const paperType = document.getElementById("paperType");
  const invalidValues = ["75", "76", "66", "85"];
  for (let i = 0; i < paperType.options.length; i++) {
    let opt = paperType.options[i];
    if (invalidValues.includes(opt.value)) {
      opt.disabled = gsm > 120;
    } else {
      opt.disabled = false;
    }
  }
}
function updateRate() {
  const paperType = document.getElementById("paperType").value;
  // If the value is numeric, set it as rate. For special cases (like 'hotmailsticker'), set a custom rate.
  let rate;
  if (!isNaN(Number(paperType))) {
    rate = paperType;
  } else if (paperType === "hotmailsticker") {
    rate = 120; // Set your custom rate for Hotmail Sticker here
  } else {
    rate = ""; // Default/fallback
  }
  document.getElementById("rate").value = rate;
}
document.getElementById("gsm").addEventListener("input", filterPaperTypeOptions);

// Hotmail Sticker controls
function onPaperTypeChange() {
  const paperType = document.getElementById("paperType").value;
  const gsmInput = document.getElementById("gsm");
  const printingType = document.getElementById("printingType");
  const lamination = document.getElementById("lamination");
  const rateRow = document.getElementById("rateRow") || document.getElementById("rate");
  const halfcuttingSection = document.getElementById("halfcutting-section");

  if (paperType === "hotmailsticker") {
    gsmInput.value = 80;
    gsmInput.min = 80;
    gsmInput.max = 90;
    printingType.value = "oneside";
    for (let i = 0; i < lamination.options.length; i++) {
      let opt = lamination.options[i];
      if (["none","mattos", "glossos", "varnishos", "thermattos", "velmattos"].includes(opt.value)) {
        opt.disabled = false;
      } else {
        opt.disabled = true;
      }
    }
    for (let i = 0; i < lamination.options.length; i++) {
      if (!lamination.options[i].disabled) {
        lamination.selectedIndex = i;
        break;
      }
    }
    if (rateRow) rateRow.style.display = "none";
    if (halfcuttingSection) halfcuttingSection.style.display = "flex";
  } else {
    gsmInput.min = 55;
    gsmInput.max = 400;
    for (let i = 0; i < lamination.options.length; i++) {
      lamination.options[i].disabled = false;
    }
    if (rateRow) rateRow.style.display = "";
    if (halfcuttingSection) halfcuttingSection.style.display = "none";
  }
}
document.getElementById("paperType").addEventListener("change", onPaperTypeChange);

// =================== MAIN CALCULATE FUNCTION ===================
function calculate() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  const gsmInput = document.getElementById("gsm");
  const gsm = parseFloat(gsmInput.value);

  if (gsmInput.value === "" || isNaN(gsm) || gsm < 55 || gsm > 400) {
    resultDiv.innerHTML = "<span style='color:red;'>GSM should be between 55 and 400.</span>";
    gsmInput.focus();
    return;
  }

  const paperTypeValue = document.getElementById("paperType").value;
  if (gsm > 120 && ["75", "76", "66", "85"].includes(paperTypeValue)) {
    resultDiv.innerHTML = "<span style='color:red;'>For GSM above 120, Maplitho, A Grade Maplitho, B Grade Maplitho, and NS Maplitho are not valid paper types.</span>";
    return;
  }

  const jobWidth = parseInputToInches(document.getElementById("jobWidth").value);
  const jobHeight = parseInputToInches(document.getElementById("jobHeight").value);
  const qty = parseInt(document.getElementById("qty").value) || 0;
  const rate = parseFloat(document.getElementById("rate").value);
  const userSelectedPrintingType = document.getElementById("printingType").value;
  let printingType = userSelectedPrintingType;

  const paperTypeText = document.getElementById("paperType").options[
    document.getElementById("paperType").selectedIndex
  ].text;

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
  const additionalProcess =
    document.getElementById("additionalProcess").options[
      document.getElementById("additionalProcess").selectedIndex
    ].text;
  const additionalProcessValue =
    document.getElementById("additionalProcess").value;

  // --- Always-On Halfcutting Inputs and Calculation ---
  const hcut = parseFloat(document.getElementById("hcut")?.value) || 0;
  const wcut = parseFloat(document.getElementById("wcut")?.value) || 0;
  const upsInput = parseFloat(document.getElementById("ups")?.value) || 0;
  let halfcuttingAmt = 0;
  if (hcut > 0 && wcut > 0 && upsInput > 0 && qty > 0) {
  if (qty > 10000) {
    halfcuttingAmt = (wcut + hcut) * 0.06 * upsInput * qty;
  } else {
    halfcuttingAmt = (wcut + hcut) * 0.07 * upsInput * qty;
  }
}
  

  let fullSheets;
  if (paperTypeValue === "hotmailsticker") {
    fullSheets = [
      { width: 18, height: 25 },
      { width: 18, height: 23 },
      { width: 15, height: 20 },
      { width: 20, height: 30 }
    ];
  } else {
    fullSheets = [
      { width: 18, height: 25 },
      { width: 18, height: 23 },
      { width: 15, height: 20 },
      { width: 20, height: 30 },
      { width: 12, height: 23 },
      { width: 15, height: 25 },
      { width: 12, height: 25 },
      { width: 19, height: 25 },
      { width: 20, height: 29.5 },
      { width: 13, height: 26 },
      { width: 14, height: 26 }
    ];
  }

  const hotmailStickerRates = {
    "18x25": 8.5,
    "18x23": 8,
    "15x20": 6,
    "20x30": 12
  };

  const bleed = 0.1378;
  const gripper = 0.7;

  const adjustedWidth = jobWidth + bleed;
  const adjustedHeight = jobHeight + bleed;

  let bestFit = { ups: 0, sheet: null, totalWastageArea: Infinity, fitW2: 0, fitH2: 0 };

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

    if (maxUps === 0) return;

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
        fitW2: fitW2,
        fitH2: fitH2
      };
    }
  });

  if (!bestFit.sheet || bestFit.ups === 0) {
    resultDiv.innerHTML =
      "<span style='color:red;'><p>Error: Job size cannot fit on any available sheet with current bleed/gripper settings.</p></span>";
    return;
  }

  // --- ALERT LOGIC ---
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

  // --- Hotmail Sticker special rate logic ---
  let paperCost;
  if (paperTypeValue === "hotmailsticker") {
    const sizeKey = `${bestFit.sheet.width}x${bestFit.sheet.height}`;
    const perSheet = hotmailStickerRates[sizeKey];
    if (perSheet) {
      paperCost = totalSheets * perSheet;
    } else {
      paperCost = 0;
      resultDiv.innerHTML = "<span style='color:red;'>No Hotmail Sticker rate found for this size (" + sizeKey + ").</span>";
      return;
    }
  } else {
    paperCost = totalPaperWeight * rate;
  }

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

  let punchCost = punching === "yes" ? Math.ceil(totalSheets / 1000) * 400 : 0 || "stickerpunching" ? Math.ceil(totalSheets/1000)*800 :0;
  

  // ---- Fabrication Calculation ----
  let fabricationCost = 0;
  switch (fabricationValue) {
    case "singlefold":
      fabricationCost = Math.ceil(qty / 1000) * 100;
      break;
    case "multifold":
      fabricationCost = Math.ceil(qty / 1000) * 150;
      break;
    case "cardfolding":
      fabricationCost = Math.ceil(qty / 1000) * 300;
      break;
    case "smallenv":
      fabricationCost = Math.ceil(qty / 1000) * 400;
      break;
    case "bigenv":
      fabricationCost = Math.ceil(qty / 1000) * 450;
      break;
    case "windowenv":
      fabricationCost = Math.ceil(qty / 1000) * 500;
      break;
    case "bigwindowenv":
      fabricationCost = Math.ceil(qty / 1000) * 550;
      break;
    case "a3gum3":
      fabricationCost = Math.ceil(qty / 1000) * 600;
      break;
    case "a3gum2":
      fabricationCost = Math.ceil(qty / 1000) * 450;
      break;
    case "a4gum2":
      fabricationCost = Math.ceil(qty / 1000) * 400;
      break;
    case "threading":
      fabricationCost = Math.ceil(qty / 1000) * 300;
      break;
    case "pouch":
      fabricationCost = Math.ceil(qty / 1000) * 750;
      break;
    case "box":
      fabricationCost = Math.ceil(qty / 1000) * 600;
      break;
    case "tentcard":
      fabricationCost = Math.ceil(qty / 1000) * 400;
      break;
    case "wobler":
      fabricationCost = Math.ceil(qty / 1000) * 1300;
      break;
    case "fullgumming":
      fabricationCost = (paperArea * 1.5 * totalSheets) / 100;
      break;
    // No halfcutting here -- always-on above!
  }

  let fabricationCostN = 0;
  switch (fabrication2Value) {
    case "singlefoldN":
      fabricationCostN = Math.ceil(qty / 1000) * 100;
      break;
    case "multifoldN":
      fabricationCostN = Math.ceil(qty / 1000) * 150;
      break;
    case "cardfoldingN":
      fabricationCostN = Math.ceil(qty / 1000) * 300;
      break;
    case "smallenvN":
      fabricationCostN = Math.ceil(qty / 1000) * 400;
      break;
    case "bigenvN":
      fabricationCostN = Math.ceil(qty / 1000) * 450;
      break;
    case "windowenvN":
      fabricationCostN = Math.ceil(qty / 1000) * 500;
      break;
    case "bigwindowenvN":
      fabricationCostN = Math.ceil(qty / 1000) * 550;
      break;
    case "a3gum3N":
      fabricationCostN = Math.ceil(qty / 1000) * 600;
      break;
    case "a3gum2N":
      fabricationCostN = Math.ceil(qty / 1000) * 450;
      break;
    case "a4gum2N":
      fabricationCostN = Math.ceil(qty / 1000) * 400;
      break;
    case "threadingN":
      fabricationCostN = Math.ceil(qty / 1000) * 300;
      break;
    case "pouchN":
      fabricationCostN = Math.ceil(qty / 1000) * 750;
      break;
    case "boxN":
      fabricationCostN = Math.ceil(qty / 1000) * 600;
      break;
    case "tentcardN":
      fabricationCostN = Math.ceil(qty / 1000) * 400;
      break;
    case "wobler":
      fabricationCostN = Math.ceil(qty / 1000) * 1300;
      break;
    case "fullgummingN":
      fabricationCostN = (paperArea * 1.5 * totalSheets) / 100;
      break;
    // No halfcutting here -- always-on above!
  }

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

  // ---- MAIN TOTAL: always include halfcuttingAmt ----
  const totalCost =
    paperCost +
    printingCost +
    lamCost +
    dieType +
    punchCost +
    fabricationCost +
    fabricationCostN +
    additionalProcessCost +
    halfcuttingAmt;

  const finalRate = totalCost / qty;

  let summary = `<h3>Job Summary</h3>`;
  let printingDisplay = "";
  switch (printingType.toLowerCase()) {
    case "selfback":
    case "doublegripper":
    case "frontback":
      printingDisplay = "4+4 Both Side";
      break;
    case "oneside":
      printingDisplay = "4+0 Oneside";
      break;
    default:
      printingDisplay = printingType;
  }

  if (qty) summary += `<p><strong>Qty:</strong> ${qty}</p>`;
  if (jobWidth && jobHeight)
    summary += `<p><strong>Size:</strong> ${jobWidth.toFixed(2)}" x ${jobHeight.toFixed(2)}" Open Size</p>`;
  if (lamination && lamination.toLowerCase() !== "none")
    summary += `<p><strong>Lamination:</strong> ${lamination}</p>`;
  if (gsm) summary += `<p><strong>GSM:</strong> ${gsm}` + `-${paperTypeText}</p>`;
  if (printingType && printingType.toLowerCase() !== "none")
    summary += `<p><strong>Printing:</strong>  ${printingDisplay}</p>`;
  if (punching && punching.toLowerCase() !== "none")
    summary += `<p><strong>Punching:</strong> ${punching}</p>`;
  if (fabrication && fabrication.toLowerCase() !== "none")
    summary += `<p><strong>Fabrication:</strong> ${fabrication}</p>`;
  if (fabricationN && fabricationN.toLowerCase() !== "none")
    summary += `<p><strong>Fabrication 2:</strong> ${fabricationN}</p>`;
  if (additionalProcess && additionalProcess.toLowerCase() !== "none")
    summary += `<p><strong>Additional Process:</strong> ${additionalProcess}</p>`;
  

  // Show Halfcutting always if calculated
  

  summary += `<hr>
<h3>Total Cost: ₹${totalCost.toFixed(2)}</h3>
<h3>Final Rate per Piece: ₹${finalRate.toFixed(2)}</h3>
<hr>

<p><strong>Best Fit:</strong> ${bestFit.ups} ups on ${bestFit.sheet.width}" x ${bestFit.sheet.height}"</p>
<p><strong>Total Sheets:</strong> ${totalSheets}</p>
<p><strong>Total Paper Weight:</strong> ${totalPaperWeight.toFixed(2)} kg</p>
<p><strong>Paper Cost:</strong> ₹${paperCost.toFixed(2)}</p>
<p><strong>Printing Cost:</strong> ₹${printingCost.toFixed(2)}</p>
<p><strong>Lamination/Varnish Cost:</strong> ₹${lamCost.toFixed(2)}</p>
<p><strong>Die Cost:</strong> ₹${dieType.toFixed(2)}</p>
<p><strong>Punching Cost:</strong> ₹${punchCost.toFixed(2)}</p>
<p><strong>Fabrication Cost:</strong> ₹${fabricationCost.toFixed(2)}</p>
<p><strong>Fabrication 2 Cost:</strong> ₹${fabricationCostN.toFixed(2)}</p>
<p><strong>Additional Process Cost:</strong> ₹${additionalProcessCost.toFixed(2)}</p>

<hr>`;
if (halfcuttingAmt > 0) {
    summary += `<p><strong>Halfcutting Cost:</strong> ₹${halfcuttingAmt.toFixed(2)}</p>`;
  }
  resultDiv.innerHTML = summary;
}

// Disable right-click and some shortcuts (unchanged)
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
  if (e.keyCode == 123) { return false; }
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; }
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; }
  if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { return false; }
};