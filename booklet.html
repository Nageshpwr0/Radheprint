function getWastage(qty) {
  switch (true) {
    case (qty <= 1500): return 100;
    case (qty <= 2500): return 150;
    case (qty <= 5000): return 200;
    case (qty <= 9000): return 250;
    case (qty <= 15000): return 350;
    default: return 500;
  }
}

function CoverWastage(qty) {
  switch (true) {
    case (qty / 2 <= 2100): return 100;
    case (qty / 2 <= 4000): return 150;
    case (qty / 2 <= 5000): return 200;
    case (qty / 2 <= 9000): return 250;
    case (qty / 2 <= 15000): return 350;
    default: return 500;
  }
}

function adjustFraction(val) {
  const fractional = val % 1;
  if (Math.abs(fractional - 0.25) < 0.01) return Math.floor(val) + 0.5;
  if (Math.abs(fractional - 0.75) < 0.01) return Math.ceil(val);
  if (Math.abs(fractional - 0.333) < 0.01) return Math.floor(val) + 0.5;
  if (Math.abs(fractional - 0.666) < 0.01) return Math.ceil(val);
  return val;
}

const paperRates = {
  'Artpaper': 78, 'ArtCard': 78, 'A Maplitho': 76, 'B Maplitho': 67,
  'Maplitho': 75, 'Shunshine': 82, 'NS maplitho': 82, 'Texture Paper': 215
};

window.updatePaperRate = function() {
  const paperType = document.getElementById('paperType').value;
  document.getElementById('rate').value = paperRates[paperType] || '';
};

function getPaperType() {
  const el = document.getElementById('paperType');
  return el ? el.value : '';
}

function toTitleCase(str) {
  return (str || "").replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function calculate() {
  const qty = parseInt(document.getElementById("qty").value);
  const pages = parseInt(document.getElementById("pages").value);
  const gsm = parseFloat(document.getElementById("gsm").value);
  const rate = parseFloat(document.getElementById("rate").value);
  const sizeSelect = document.getElementById("paper-size");
  const size = sizeSelect.value;
  const printing = document.getElementById("printing-type").value;
  const lamination = document.getElementById("lamination").value;
  const binding = document.getElementById("binding-type").value;
  const coverGsm = parseFloat(document.getElementById("coverGsm").value);
  const coverPrintingColor = document.getElementById("coverPrintingColor").value;
  const coverLamination = document.getElementById("coverLamination").value;
  const uvType = document.getElementById("uvType").value;
  const foilingType = document.getElementById("foilingType").value;
  const dripUpType = document.getElementById("dripUpType").value;
  if (isNaN(qty) || qty <= 0) { alert("Please enter a valid Quantity."); return; }
  if (isNaN(pages) || pages <= 0) { alert("Please enter a valid number of Pages."); return; }
  if (pages % 4 !== 0) { alert("Number of pages must be divisible by 4."); return; }
  if (isNaN(rate) || rate <= 0) { alert("Please enter a valid Paper Rate."); return; }
  if (isNaN(gsm) || gsm <= 0) { alert("Please enter a valid GSM."); return; }
  if (!size) { alert("Please select paper size."); return; }
  if (!printing) { alert("Please select printing type."); return; }
  const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
  if (!selectedOption) { alert("Error: Could not retrieve paper size data. Please re-select paper size."); return; }
  const weight = parseFloat(selectedOption.getAttribute("data-weight"));
  const ups = parseFloat(selectedOption.getAttribute("data-ups"));
  const imp = parseFloat(selectedOption.getAttribute("data-imp"));
  const makrdy = parseFloat(selectedOption.getAttribute("data-makrdy"));
  const wastage = getWastage(qty);
  const totalSheets = ((qty + wastage) * pages) / ups;
  const paperCost = (weight * gsm) / 3100 * (rate / 500) * totalSheets;
  const paperCostpad = (weight * gsm) / 3100 * (rate / 500);
  let pageUps = pages / ups; pageUps = adjustFraction(pageUps);

  let printingCost = 0;
  const isSmallSize = ["A4", "A5", "A6", "Letter", "Half-Letter"].includes(size);
  const isSpecial = ["7.1x9.5", "7.1x4.75"].includes(size);
  const isCommonRuledValidSize = ["A4", "A5", "A6", "Letter", "Half-Letter", "7.1x9.5", "7.1x4.75"].includes(size);

  if (printing === "multi") {
    if (qty < 1000) printingCost = Math.max((makrdy * pages / ups) * 2, 1900);
    else printingCost = (Math.ceil(qty / 1000) * imp + (makrdy - imp)) * pageUps * 2;
  } else if (printing === "single") {
    if (!(isSmallSize || isSpecial)) { alert("Single color is only allowed for A4, A5, A6, Letter, Half-Letter, 7.1x9.5, 7.1x4.75"); return; }
    if (qty < 1000) printingCost = (600 * pages / ups) * 2;
    else if (isSpecial) printingCost = (Math.ceil(qty / 1000) * 200 + (600 - 200)) * pageUps * 4;
    else printingCost = (Math.ceil(qty / 1000) * 150 + (600 - 150)) * pageUps * 2;
  } else if (printing === "2+2") {
    if (!(isSmallSize || isSpecial)) { alert("2+2 color is only allowed for A4, A5, A6,Letter, Half-Letter, 7.1x9.5, 7.1x4.75"); return; }
    if (qty < 1000) printingCost = makrdy;
    else if (isSpecial) printingCost = (Math.ceil(qty / 1000) * 200 + (800 - 200)) * pageUps * 4;
    else printingCost = (Math.ceil(qty / 1000) * 200 + (800 - 200)) * pageUps * 2;
  } else if (printing === "common-ruled-4+4") {
    const sheetsNeededForRuled = (qty * pages / ups) + wastage;
    if (size === "7.1x9.5") printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 2 * 500 + 2200;
    else printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 2 * 400 + 1600;
  } else if (printing === "common-ruled-2+2") {
    if (!isCommonRuledValidSize) { alert("Commen rulled 2+2 is only allowed for A4, A5, A6, Letter, Half-Letter, 7.1x9.5, 7.1x4.75"); return; }
    const sheetsNeededForRuled = (qty * pages / ups) + wastage;
    printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 2 * 200 + 600;
  } else if (printing === "common-ruled-1+1") {
    if (!isCommonRuledValidSize) { alert("Commen rulled 1+1 is only allowed for A4, A5, A6, Letter, Half-Letter, 7.1x9.5, 7.1x4.75"); return; }
    const sheetsNeededForRuled = (qty * pages / ups) + wastage;
    printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 2 * 150 + 450;
  } else if (printing === "common-ruled-4+0") {
    const sheetsNeededForRuled = (qty * pages / ups) + wastage;
    if (size === "7.1x9.5") printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 1 * 500 + 2200;
    else printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 1 * 400 + 1600;
  } else if (printing === "common-ruled-2+0") {
    if (!isCommonRuledValidSize) { alert("Commen rulled 2+0 is only allowed for A4, A5, A6, Letter, Half-Letter, 7.1x9.5, 7.1x4.75"); return; }
    const sheetsNeededForRuled = (qty * pages / ups) + wastage;
    printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 1 * 200 + 600;
  } else if (printing === "common-ruled-1+0") {
    if (!isCommonRuledValidSize) { alert("Commen rulled 1+0 is only allowed for A4, A5, A6, Letter, Half-Letter, 7.1x9.5, 7.1x4.75"); return; }
    const sheetsNeededForRuled = (qty * pages / ups) + wastage;
    printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 1 * 150 + 450;
  }

  let laminationCost = 0;
  if (lamination !== "none") {
    if (lamination === "matt-all") laminationCost = weight * 0.48 * (qty + wastage) / 100 * (pages / ups * 2 + 0.5);
    else if (lamination === "gloss-all") laminationCost = weight * 0.45 * (qty + wastage) / 100 * (pages / ups * 2 + 0.5);
    else if (lamination === "varnish-all") laminationCost = weight * 0.25 * (qty + wastage) / 100 * (pages / ups * 2 + 0.5);
  }
  let coverPaperCost = 0, coverPrintingCost = 0, coverLaminationCost = 0;
  if (binding !== 'hardbound-gally-section') {
    const coverWastage = CoverWastage(qty);
    coverPaperCost = (weight * coverGsm) / 3100 * (rate / 500) * ((qty * 4 / ups) + coverWastage);
    const sheetsNeededForCoverImpression = qty / (ups / 4);
    const qty2 = qty + coverWastage;
    if (coverPrintingColor === "multi") {
      if (qty < 1000) coverPrintingCost = makrdy;
      else coverPrintingCost = (Math.ceil(qty2 / (ups / 8) / 1000) * imp + (makrdy - imp));
    } else if (coverPrintingColor === "single") {
      coverPrintingCost = (Math.ceil(qty2 / (ups / 8) / 1000) * 150 + (600 - 150));
    } else if (coverPrintingColor === "2+2") {
      coverPrintingCost = (Math.ceil(qty2 / (ups / 8) / 1000) * 200 + (800 - 200));
    }
    if (coverLamination !== "none") {
      if (coverLamination === "matt") coverLaminationCost = ((qty) / (ups / 4) + coverWastage) * weight * 0.45 / 100 * 1;
      else if (coverLamination === "thermal") coverLaminationCost = ((qty) / (ups / 4) + coverWastage) * weight * 0.85 / 100 * 1;
      else if (coverLamination === "velvet") coverLaminationCost = ((qty) / (ups / 4) + coverWastage) * weight * 3 / 100 * 1;
      else if (coverLamination === "gloss") coverLaminationCost = ((qty) / (ups / 4) + coverWastage) * weight * 0.42 / 100 * 1;
      else if (coverLamination === "varnish") coverLaminationCost = ((qty) / (ups / 4) + coverWastage) * weight * 0.25 / 100 * 1;
    }
  }
  let bindingCost = 0;
  switch (binding) {
    case "center-pinning":
      if (qty <= 1200) {
        if (pages < 30) bindingCost = qty * pages * 0.05;
        else if (pages <= 45) bindingCost = qty * pages * 0.05;
        else if (pages <= 60) bindingCost = qty * pages * 0.04;
        else if (pages <= 72) bindingCost = qty * pages * 0.03;
        else bindingCost = qty * pages * 0.02;
      } else if (qty >= 1201 && qty <= 3000) {
        if (pages < 30) bindingCost = qty * pages * 0.04;
        else if (pages <= 72) bindingCost = qty * pages * 0.03;
        else bindingCost = qty * pages * 0.02;
      } else {
        if (pages <= 10) bindingCost = qty * pages * 0.065;
        else if (pages > 10 && pages <= 16) bindingCost = qty * pages * 0.04;
        else if (pages > 16 && pages <= 30) bindingCost = qty * pages * 0.025;
        else bindingCost = qty * pages * 0.02;
      }
      bindingCost = Math.max(bindingCost, 1200); break;
    case "section-perfect":
      
   let ratesection;

if (qty > 1000 && qty <= 3100) {
  if (pages > 100) {
    ratesection = 0.05;
  } else if (pages >= 60 && pages <= 100) {
    ratesection = 0.06;
  } else if (pages >= 35 && pages < 60) {
    ratesection = 0.07;
  } else if (pages < 35) {
    ratesection = 0.08;
  }
} else if (qty > 3100 && qty <= 6000) {
  if (pages > 60) {
    ratesection = 0.05;
  } else if (pages >= 36 && pages <= 60) {
    ratesection = 0.06;
  } else if (pages <= 35) {
    ratesection = 0.07;
  }
} else if (qty > 6000) {
  if (pages > 60) {
    ratesection = 0.5;
  } else if (pages <= 60) {
    ratesection = 0.6;
  }
} else {
  // default rate for qty <= 1000
  if (pages > 150) {
    ratesection = 0.05;
  } else if (pages >= 100 && pages <= 150) {
    ratesection = 0.06;
  } else if (pages >= 60 && pages < 100) {
    ratesection = 0.07;
  } else if (pages < 60) {
    ratesection = 0.08;
  }
}

bindingCost = qty * ratesection * (pages + 4);
bindingCost = Math.max(bindingCost, 4000) ; break;
    case "perfect-binding":
      if (qty > 2500) bindingCost = qty * 0.035 * (pages + 4);
      else bindingCost = qty * 0.04 * (pages + 4);
      bindingCost = Math.max(bindingCost, 3000); break;
    case "top-perfect-pad":
      if (size === "A5" || size === "Half-Letter") {
        bindingCost = qty * 0.80 - (paperCostpad * wastage * (pages / ups - 1));
        bindingCost = Math.max(bindingCost, 2500 - (paperCostpad * wastage * (pages / ups - 1)));
      } else if (size === "A4" || size === "Letter") {
        bindingCost = qty * 1.50 - (paperCostpad * wastage * (pages / ups - 1));
        bindingCost = Math.max(bindingCost, 3000 - (paperCostpad * wastage * (pages / ups - 1)));
      } else if (size === "7.1x9.5") {
        bindingCost = qty * 1.40 - (paperCostpad * wastage * (pages / ups - 1));
        bindingCost = Math.max(bindingCost, 3000 - (paperCostpad * wastage * (pages / ups - 1)));
      } else if (size === "7.1x4.75") {
        bindingCost = qty * 0.80 - (paperCostpad * wastage * (pages / ups - 1));
      } else { alert("Top Perfect Pad binding is not available for the selected paper size."); return; }
      break;
    case "wiro":
      if (size === "A5" || size === "Half-Letter") {
        bindingCost = (qty * pages * gsm * 21 * 0.06) / 1400 - (paperCostpad * wastage * (pages / ups - 1));
        bindingCost = Math.max(bindingCost, 3500 - (paperCostpad * wastage * (pages / ups - 1)));
      } else if (size === "A4" || size === "Letter") {
        bindingCost = (qty * pages * gsm * 33 * 0.05) / 1500 - (paperCostpad * wastage * (pages / ups - 1));
        bindingCost = Math.max(bindingCost, 3000 - (paperCostpad * wastage * (pages / ups - 1)));
      } else if (size === "7.1x9.5") {
        bindingCost = (qty * pages * gsm * 28 * 0.05) / 1500 - (paperCostpad * wastage * (pages / ups - 1));
        bindingCost = Math.max(bindingCost, 3000 - (paperCostpad * wastage * (pages / ups - 1)));
      } else if (size === "7.1x4.75") {
        bindingCost = (qty * pages * gsm * 18 * 0.05) / 1500 - (paperCostpad * wastage * (pages / ups - 1));
      } else { alert("Top Perfect Pad binding is not available for the selected paper size."); return; }
      break;
    case "visulate-soft-bond":
      if (pages <= 100) bindingCost = qty * 3;
      else if (pages <= 200) bindingCost = qty * 4;
      else bindingCost = qty * 5;
      bindingCost = Math.max(bindingCost, 5000); break;
    case "visulate-hard-bond-galy":
      if (pages <= 100) bindingCost = qty * 5;
      else if (pages <= 200) bindingCost = qty * 6;
      else bindingCost = qty * 7;
      bindingCost = Math.max(bindingCost, 7000); break;
    case "loop-pinning":
      if (pages <= 100) bindingCost = qty * 2;
      else if (pages <= 200) bindingCost = qty * 1.5;
      else bindingCost = qty * 1.5;
      bindingCost = Math.max(bindingCost, 2500); break;
    case "hardbound-gally-section":
      if (["A5", "Half-Letter"].includes(size)) bindingCost = (2 * qty + wastage) + (Math.ceil(qty / 1000) / 2 * 400 + 1600) + (4 * (qty + wastage)) + (15.5 * qty) + (2 * qty) + (qty * pages * 0.08);
      else if (["A4", "Letter"].includes(size)) bindingCost = (4 * qty + wastage) + (Math.ceil(qty / 1000) * 400 + 1600) + (6 * (qty + wastage)) + (21 * qty) + (4 * qty) + (qty * pages * 0.08);
      else if (size === "7.1x9.5") bindingCost = (3 * qty + wastage) + (Math.ceil(qty / 1000) * 400 + 1600) + (5 * (qty + wastage)) + (17 * qty) + (3 * qty) + (qty * pages * 0.08);
      else if (size === "9.5x13.5") bindingCost = (4 * qty + wastage) + (Math.ceil(qty / 1000) * 400 + 1600) + (8 * (qty + wastage)) + (25 * qty) + (5 * qty) + (qty * pages * 0.08);
      else if (["12x12", "11x11"].includes(size)) bindingCost = (6 * qty + wastage) + (Math.ceil(qty / 1000) * 400 + 1600) + (8 * (qty + wastage)) + (18 * qty) + (4 * qty) + (qty * pages * 0.08);
      else if (["8x8", "9x9"].includes(size)) bindingCost = (5 * qty + wastage) + (Math.ceil(qty / 1000) * 400 + 1600) + (6 * (qty + wastage)) + (17 * qty) + (3 * qty) + (qty * pages * 0.08);
      else { alert("Please select a supported paper size for Hardbound Gally Section binding."); return; }
      break;
    case "none": default: bindingCost = 0; break;
  }
  if (getPaperType() === "ArtCard") {
    const artCardExtra = ((pages / 4) * qty * 200) / 1000;
    bindingCost += artCardExtra;
  }
  let uvCost = 0, foilingCost = 0, dripupCost = 0;
  if (uvType === "spot-uv-cover") uvCost = Math.max(Math.ceil(qty / 1000) * 1800, 2000);
  else if (uvType === "raised-uv-cover") uvCost = Math.max(Math.ceil(qty / 1000) * 2300, 2700);
  else if (uvType === "spot-uv-all-pages") uvCost = (Math.ceil(qty / 1000) * 1800) * (pages / ups * 2);
  if (foilingType === "stamp-foil-cover") foilingCost = Math.max(Math.ceil(qty / 1000) * 2200, 3500);
  else if (foilingType === "magic-gold-foil-cover") foilingCost = Math.max(Math.ceil(qty / 1000) * 8000, 8000);
  if (dripUpType === "drip-up-cover") dripupCost = Math.max(Math.ceil(qty / 1000) * 5000, 6000);
  else if (dripUpType === "drip-up-all-pages") {
    const baseCost = (weight * 0.75 * (qty + wastage) / 100) + 1000;
    const pageFactor = ((pages + 4) / ups * 2);
    dripupCost = Math.max(baseCost * pageFactor + bindingCost, 6000);
  }
  const FinalAmt = (paperCost + printingCost + laminationCost + bindingCost + coverPaperCost + coverPrintingCost + coverLaminationCost + uvCost + foilingCost + dripupCost);
  const BookletRate = FinalAmt / qty;
  // RESULTS TABLE
  const results = [
    { id: "paper-cost", label: "Paper Cost", value: `₹ ${paperCost.toFixed(2)}` },
    { id: "cover-paper-cost", label: "Cover Paper Cost", value: `₹ ${coverPaperCost.toFixed(2)}` },
    { id: "printing-cost", label: "Printing Cost", value: `₹ ${printingCost.toFixed(2)}` },
    { id: "cover-printing-cost", label: "Cover Printing Cost", value: `₹ ${coverPrintingCost.toFixed(2)}` },
    { id: "lamination-cost", label: "Lamination Cost", value: `₹ ${laminationCost.toFixed(2)}` },
    { id: "cover-lamination-cost", label: "Cover Lamination Cost", value: `₹ ${coverLaminationCost.toFixed(2)}` },
    { id: "binding-cost", label: "Binding Cost", value: `₹ ${bindingCost.toFixed(2)}` },
    { id: "uv-cost", label: "Uv Cost", value: `₹ ${uvCost.toFixed(2)}` },
    { id: "foiling-cost", label: "Foiling Cost", value: `₹ ${foilingCost.toFixed(2)}` },
    { id: "dripup-cost", label: "Dripup Cost", value: `₹ ${dripupCost.toFixed(2)}` },
    { id: "Final-Amount", label: "Final Amount", value: `₹ ${FinalAmt.toFixed(2)}` },
    { id: "Final-Rate", label: "Final Rate", value: `₹ ${BookletRate.toFixed(2)}` }
  ];
  results.forEach(item => {
    const cell = document.getElementById(item.id);
    if (cell) {
      if (item.id === 'Final-Amount' || item.id === 'Final-Rate') {
        cell.innerHTML = '<strong>' + toTitleCase(item.value) + '</strong>';
      } else {
        cell.textContent = toTitleCase(item.value);
      }
    }
  });
  // SUMMARY TABLE
  const fields = [
    { label: "Quantity", value: document.getElementById('qty').value },
    { label: "Book Size", value: document.getElementById('paper-size').value },
    { label: "total Pages", value: document.getElementById('pages').value + "+4 pages, " + (document.getElementById('pages').value) / 2  +"+2 leaves" },
    { label: "Inner GSM", value: document.getElementById('gsm').value + " GSM" },
    { label: "Printing Type", value: document.getElementById('printing-type').value + "-color" },
    { label: "Inner Lamination / Varnish", value: document.getElementById('lamination').value + "--lamination" },
    { label: "Binding Type", value: document.getElementById('binding-type').value },
    { label: "Cover GSM", value: document.getElementById('coverGsm').value + " GSM" },
    { label: "Cover Printing Color", value: document.getElementById('coverPrintingColor').value + "-color" },
    { label: "Cover Lamination Type", value: document.getElementById('coverLamination').value + "-lamination" },
    { label: "Uv", value: document.getElementById('uvType').value },
    { label: "Foiling", value: document.getElementById('foilingType').value },
    { label: "Dripup", value: document.getElementById('dripUpType').value }
  ];
  const summaryTableBody = document.querySelector('#summary-table tbody');
  summaryTableBody.innerHTML = '';
  fields.forEach(item => {
    if (
      item.value &&
      item.value !== "none" &&
      !item.value.startsWith("--") &&
      item.value !== "No Cover Lamination"
    ) {
      const row = document.createElement('tr');
      const itemCell = document.createElement('td');
      const valueCell = document.createElement('td');
      itemCell.textContent = toTitleCase(item.label);
      valueCell.textContent = toTitleCase(item.value);
      row.appendChild(itemCell);
      row.appendChild(valueCell);
      summaryTableBody.appendChild(row);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('paperType').addEventListener('change', window.updatePaperRate);
  window.updatePaperRate();
  const bindingTypeSelect = document.getElementById('binding-type');
  const coverDetailsSection = document.getElementById('coverDetailsSection');
  const toggleAdditionalProcessButton = document.getElementById('toggleAdditionalProcess');
  const additionalProcessContent = document.getElementById('additionalProcessContent');
  function toggleCoverSection() {
    if (bindingTypeSelect.value === 'hardbound-gally-section') {
      coverDetailsSection.style.display = 'none';
      document.getElementById("coverGsm").value = "250";
      document.getElementById("coverPrintingColor").value = "none";
      document.getElementById("coverLamination").value = "none";
    } else {
      coverDetailsSection.style.display = '';
    }
  }
  function toggleAdditionalProcessSection() {
    additionalProcessContent.classList.toggle('show');
    if (additionalProcessContent.classList.contains('show')) {
      additionalProcessContent.style.maxHeight = additionalProcessContent.scrollHeight + "px";
    } else {
      additionalProcessContent.style.maxHeight = "0";
    }
  }
  bindingTypeSelect.addEventListener('change', toggleCoverSection);
  toggleAdditionalProcessButton.addEventListener('click', toggleAdditionalProcessSection);
  toggleCoverSection();
  additionalProcessContent.style.maxHeight = "0";
  additionalProcessContent.classList.remove('show');
});
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {
  if (e.keyCode == 123) { return false; }
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; }
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; }
  if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { return false; }
};
