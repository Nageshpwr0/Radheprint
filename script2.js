
function getWastage(qty) {
  switch (true) {
    case (qty <= 1500):
      return 100;
      break;
    case (qty <= 2500):
      return 150;
      break;
    case (qty <= 5000):
      return 200;
      break;
    case (qty <= 9000):
      return 250;
      break;
    case (qty <= 15000):
      return 350;
      break;
    default:
      return 500;
      break;
  }
}

function CoverWastage(qty) {
  switch (true) {
    case (qty/2 <= 2100):
      return 100;
      break;
    case (qty/2 <= 4000):
      return 150;
      break;
    case (qty/2 <= 5000):
      return 200;
      break;
    case (qty/2 <= 9000):
      return 250;
      break;
    case (qty/2 <= 15000):
      return 350;
      break;
    default:
      return 500;
      break;
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

    // Cover Inputs
    const coverGsm = parseFloat(document.getElementById("coverGsm").value);
    const coverPrintingColor = document.getElementById("coverPrintingColor").value;
    const coverLamination = document.getElementById("coverLamination").value;

    // Additional Process Inputs
    const uvType = document.getElementById("uvType").value;
    const foilingType = document.getElementById("foilingType").value;
    const dripUpType = document.getElementById("dripUpType").value;

    // --- DEBUGGING: Log input values ---
    console.log("--- Calculation Inputs ---");
    console.log("Quantity (qty):", qty);
    console.log("Number of Pages (pages):", pages);
    console.log("GSM (gsm):", gsm);
    console.log("Paper Rate (rate):", rate);
    console.log("Paper Size (size):", size);
    console.log("Printing Type (printing):", printing);
    console.log("Lamination (lamination):", lamination);
    console.log("Binding Type (binding):", binding);
    console.log("Cover GSM (coverGsm):", coverGsm);
    console.log("Cover Printing Color (coverPrintingColor):", coverPrintingColor);
    console.log("Cover Lamination (coverLamination):", coverLamination);
    console.log("UV Type:", uvType);
    console.log("Foiling Type:", foilingType);
    console.log("DripUp Type:", dripUpType);
    console.log("-------------------------");


    if (isNaN(qty) || qty <= 0) { alert("Please enter a valid Quantity."); return; }
    if (isNaN(pages) || pages <= 0) { alert("Please enter a valid number of Pages."); return; }
    if (pages % 4 !== 0) { alert("Number of pages must be divisible by 4."); return; }
    if (isNaN(rate) || rate <= 0) { alert("Please enter a valid Paper Rate."); return; }
    if (isNaN(gsm) || gsm <= 0) { alert("Please enter a valid GSM."); return; }
    if (!size) { alert("Please select paper size."); return; }
    if (!printing) { alert("Please select printing type."); return; }

    const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
    if (!selectedOption) {
        alert("Error: Could not retrieve paper size data. Please re-select paper size.");
        return;
    }

    const weight = parseFloat(selectedOption.getAttribute("data-weight"));
    const ups = parseFloat(selectedOption.getAttribute("data-ups"));
    const imp = parseFloat(selectedOption.getAttribute("data-imp"));
    const makrdy = parseFloat(selectedOption.getAttribute("data-makrdy"));
    const wastage = getWastage(qty);

    // --- DEBUGGING: Log derived values ---
    console.log("--- Derived Values ---");
    console.log("Weight (data-weight):", weight);
    console.log("UPS (data-ups):", ups);
    console.log("IMP (data-imp):", imp);
    console.log("Makeready (data-makrdy):", makrdy);
    console.log("Wastage:", wastage);
    console.log("-------------------------");


    // --- INNER PAGES CALCULATIONS ---
    const totalSheets = ((qty + wastage) * pages) / ups;
    const paperCost = (weight * gsm) / 3100 * (rate / 500) * totalSheets;
    const paperCostpad = (weight * gsm) / 3100 * (rate / 500);
    let pageUps = pages / ups;
    pageUps = adjustFraction(pageUps);

    // PRINTING COST (INNER PAGES)
    let printingCost = 0;
    const isSmallSize = ["A4", "A5", "A6" , "Letter", "Half-Letter"].includes(size);
    const isSpecial = ["7.1x9.5", "7.1x4.75"].includes(size);
    const isCommonRuledValidSize = ["A4", "A5", "A6", "Letter", "Half-Letter", "7.1x9.5", "7.1x4.75"].includes(size);


    if (printing === "multi") {
        if (qty < 1000) {
            printingCost = Math.max((makrdy * pages / ups) * 2, 1900);
        } else {
            printingCost = (Math.ceil(qty / 1000) * imp + (makrdy - imp)) * pageUps * 2;
        }
    } else if (printing === "single") {
        if (!(isSmallSize || isSpecial)) {
            alert("Single color is only allowed for A4, A5, A6, Letter, Half-Letter, 7.1x9.5, 7.1x4.75");
            return;
        }
        if (qty < 1000) {
            printingCost = (600 * pages / ups) * 2;
        } else if (isSpecial) {
            printingCost = (Math.ceil(qty / 1000) * 200 + (600 - 200)) * pageUps * 4;
        } else {
            printingCost = (Math.ceil(qty / 1000) * 150 + (600 - 150)) * pageUps * 2;
        }
    } else if (printing === "2+2") {
        if (!(isSmallSize || isSpecial)) {
            alert("2+2 color is only allowed for A4, A5, A6,Letter, Half-Letter, 7.1x9.5, 7.1x4.75");
            return;
        }
        if (qty < 1000) {
            printingCost = makrdy;
        } else if (isSpecial) {
            printingCost = (Math.ceil(qty / 1000) * 200 + (800 - 200)) * pageUps * 4;
        } else {
            printingCost = (Math.ceil(qty / 1000) * 200 + (800 - 200)) * pageUps * 2;
        }
    }
    // New conditions for "Commen rulled" inner pages
    else if (printing === "common-ruled-4+4") {
        const sheetsNeededForRuled = (qty * pages / ups) + wastage;
        if (size === "7.1x9.5") {
            printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 2 * 500 + 2200;
        } else {
            printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 2 * 400 + 1600;
        }
    } else if (printing === "common-ruled-2+2") {
        if (!isCommonRuledValidSize) {
            alert("Commen rulled 2+2 is only allowed for A4, A5, A6, Letter, Half-Letter, 7.1x9.5, 7.1x4.75");
            return;
        }
        const sheetsNeededForRuled = (qty * pages / ups) + wastage;
        printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 2 * 200 + 600;
    } else if (printing === "common-ruled-1+1") {
        if (!isCommonRuledValidSize) {
            alert("Commen rulled 1+1 is only allowed for A4, A5, A6, Letter, Half-Letter, 7.1x9.5, 7.1x4.75");
            return;
        }
        const sheetsNeededForRuled = (qty * pages / ups) + wastage;
        printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 2 * 150 + 450;
    }

   // New conditions for "Commen rulled oneside" inner pages
    else if (printing === "common-ruled-4+0") {
        const sheetsNeededForRuled = (qty * pages / ups) + wastage;
        if (size === "7.1x9.5") {
            printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 1 * 500 + 2200;
        } else {
            printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 1 * 400 + 1600;
        }
    } else if (printing === "common-ruled-2+0") {
        if (!isCommonRuledValidSize) {
            alert("Commen rulled 2+0 is only allowed for A4, A5, A6, Letter, Half-Letter, 7.1x9.5, 7.1x4.75");
            return;
        }
        const sheetsNeededForRuled = (qty * pages / ups) + wastage;
        printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 1 * 200 + 600;
    } else if (printing === "common-ruled-1+0") {
        if (!isCommonRuledValidSize) {
            alert("Commen rulled 1+0 is only allowed for A4, A5, A6, Letter, Half-Letter, 7.1x9.5, 7.1x4.75");
            return;
        }
        const sheetsNeededForRuled = (qty * pages / ups) + wastage;
        printingCost = Math.ceil(sheetsNeededForRuled / 1000) * 1 * 150 + 450;
    }

    // LAMINATION COST CALCULATION (INNER PAGES)
    let laminationCost = 0;
    if (lamination !== "none") {
        if (lamination === "matt-all") {
            laminationCost = weight * 0.48 * (qty + wastage) / 100 * (pages / ups * 2 + 0.5);
        } else if (lamination === "gloss-all") {
            laminationCost = weight * 0.45 * (qty + wastage) / 100 * (pages / ups * 2 + 0.5);
        } else if (lamination === "varnish-all") {
            laminationCost = weight * 0.25 * (qty + wastage) / 100 * (pages / ups * 2 + 0.5);
        }
    }

    // --- COVER CALCULATIONS ---
    // Only calculate cover costs if the "Hardbound Gally Section" binding is NOT selected
    let coverPaperCost = 0;
    let coverPrintingCost = 0;
    let coverLaminationCost = 0;

    if (binding !== 'hardbound-gally-section') {
        // Assuming cover takes 4 pages worth of area (front/back outer, front/back inner)
        // and a specific wastage for cover sheets, which is 1.5 times less than inner wastage for now
        // Adjusted wastage for cover to be more direct based on a fixed value (e.g., 50 sheets) or a percentage of qty
        // Let's use a simpler approach for cover wastage for now, e.g., Math.max(10, qty * 0.02)
        const coverWastage = CoverWastage(qty); // Example: min 20 sheets or 4% of qty
        coverPaperCost = (weight * coverGsm) / 3100 * (rate / 500) * ((qty * 4 / ups) + coverWastage);


        // COVER PRINTING COST based on your requested formulas
        // For cover, 'no of page' equivalent can be considered as the number of 'sides' or 'impressions' on the cover sheet.
        // A standard book cover is usually a single sheet printed on two sides (front/back).
        // The "pages" in your common ruled formula would typically refer to the content pages.
        // For simplicity and based on your provided structure, I'll calculate `sheetsNeededForRuledCover`
        // using `qty / ups` (number of main sheets for covers) plus a portion of the wastage.
        // If cover printing is different (e.g., fixed cost per thousand covers), adjust this.
        const sheetsNeededForCoverImpression = qty / (ups /4); // Assuming smaller wastage for cover impressions or a different calculation
        const qty2 =  qty + coverWastage;
        if (coverPrintingColor === "multi") {
            if (qty < 1000) {
                coverPrintingCost = makrdy;
            } else {
                coverPrintingCost = (Math.ceil(qty2 / (ups/8)  / 1000)* imp + (makrdy - imp));
            }
        } else if (coverPrintingColor === "single") {
            coverPrintingCost = (Math.ceil(qty2 /(ups/8)/ 1000) * 150 + (600 - 150));
        } else if (coverPrintingColor === "2+2") {
            coverPrintingCost = (Math.ceil(qty2 /(ups/8) / 1000) * 200 + (800 - 200));
        }
        // These common-ruled options were not explicitly for cover, but if they apply to cover, keep them.
        // For now, I'm keeping them as they were in the previous version, assuming `coverPrintingColor` might have such values.
        else if (coverPrintingColor === "cover-common-ruled-4+4") {
            if (size === "7.1x9.5") { // This condition is based on the *inner* paper size
                coverPrintingCost = Math.ceil(sheetsNeededForCoverImpression / 1000) * 500 + 2200;
            } else {
                coverPrintingCost = Math.ceil(sheetsNeededForCoverImpression / 1000) * 400 + 1600;
            }
        } else if (coverPrintingColor === "cover-common-ruled-2+2") {
            coverPrintingCost = Math.ceil(sheetsNeededForCoverImpression / 1000) * 200 + 600;
        } else if (coverPrintingColor === "cover-common-ruled-1+1") {
            coverPrintingCost = Math.ceil(sheetsNeededForCoverImpression / 1000) * 150 + 450;
        }


        if (coverLamination !== "none") {
            if (coverLamination === "matt") {
                coverLaminationCost = ((qty)/(ups/4)+coverWastage) * weight * 0.45 / 100 * 1;
            } else if (coverLamination === "thermal") {
                coverLaminationCost = ((qty)/(ups/4)+coverWastage) * weight * 0.85 / 100 * 1;
            } else if (coverLamination === "velvet") {
                coverLaminationCost = ((qty)/(ups/4)+coverWastage) * weight * 3 / 100 * 1;
            } else if (coverLamination === "gloss") {
                coverLaminationCost = ((qty)/(ups/4)+coverWastage) * weight * 0.42 / 100 * 1;
            } else if (coverLamination === "varnish") {
                coverLaminationCost = ((qty)/(ups/4)+coverWastage) * weight * 0.25 / 100 * 1;
            } 
        }
    }


     // BINDING COST CALCULATION
    let bindingCost = 0;
    switch (binding) {
        case "center-pinning":
            if (qty <= 1200) {
                if (pages < 30) {
                    bindingCost = qty * pages * 0.05;
                } else if (pages <= 45) {
                    bindingCost = qty * pages * 0.05;
                } else if (pages <= 60) {
                    bindingCost = qty * pages * 0.04;
                } else if (pages <= 72) {
                    bindingCost = qty * pages * 0.03;
                } else {
                    bindingCost = qty * pages * 0.02;
                }
            } else if (qty >= 1201 && qty <= 3000) {
                if (pages < 30) {
                    bindingCost = qty * pages * 0.04;
                } else if (pages <= 72) {
                    bindingCost = qty * pages * 0.03;
                } else {
                    bindingCost = qty * pages * 0.02;
                }
            } else {
                if (pages <= 10) {
                    bindingCost = qty * pages * 0.065;
                } else if (pages > 10 && pages <= 16) {
                    bindingCost = qty * pages * 0.04;
                } else if (pages > 16 && pages <= 30) {
                    bindingCost = qty * pages * 0.025;
                } else {
                    bindingCost = qty * pages * 0.02;
                }
            }
            bindingCost = Math.max(bindingCost, 1200);
            break;
        case "section-perfect":
            if (qty > 2500) {
                bindingCost = qty * 0.06 * (pages + 4);
            } else {
                bindingCost = qty * 0.08 * (pages + 4);
            }
            bindingCost = Math.max(bindingCost, 4000);
            break;
        case "perfect-binding":
            if (qty > 2500) {
                bindingCost = qty * 0.035 * (pages + 4);
            } else {
                bindingCost = qty * 0.04 * (pages + 4);
            }
            bindingCost = Math.max(bindingCost, 3000);
            break;
        
        // START OF NEW CODE BLOCK TO ADD
        case "top-perfect-pad":
            if (size === "A5" || size === "Half-Letter") {
                bindingCost = qty * 0.80 - (paperCostpad* wastage * (pages/ ups-1));
                bindingCost = Math.max(bindingCost, 2500- (paperCostpad* wastage * (pages/ ups-1)));
            } else if (size === "A4" || size === "Letter") {
                bindingCost = qty * 1.50 - (paperCostpad* wastage * (pages/ ups-1));
                bindingCost = Math.max(bindingCost, 3000- (paperCostpad* wastage * (pages/ ups-1)));
            } else if (size === "7.1x9.5") {
                bindingCost = qty * 1.40 - (paperCostpad* wastage * (pages/ ups-1));
                bindingCost = Math.max(bindingCost, 3000- (paperCostpad* wastage * (pages/ ups-1)));
            } else if (size === "7.1x4.75") {
                bindingCost = qty * 0.80 - (paperCostpad* wastage * (pages/ ups-1));
                // Note: No minimum amount was specified for this size.
            } else {
                 alert("Top Perfect Pad binding is not available for the selected paper size.");
                 return; // Stop the calculation
            }
            break;

            case "wiro":
            if (size === "A5" || size === "Half-Letter") {
                bindingCost = (qty * pages * gsm * 21 * 0.06 )/1400- (paperCostpad* wastage * (pages/ ups-1));
                bindingCost = Math.max(bindingCost, 3500- (paperCostpad* wastage * (pages/ ups-1)));
            } else if (size === "A4" || size === "Letter") {
                bindingCost = (qty * pages * gsm * 33 * 0.05 )/1500- (paperCostpad* wastage * (pages/ ups-1));
                bindingCost = Math.max(bindingCost, 3000- (paperCostpad* wastage * (pages/ ups-1)));
            } else if (size === "7.1x9.5") {
                bindingCost = (qty * pages * gsm * 28 * 0.05 )/1500 - (paperCostpad* wastage * (pages/ ups-1));
                bindingCost = Math.max(bindingCost, 3000- (paperCostpad* wastage * (pages/ ups-1)));
            } else if (size === "7.1x4.75") {
                bindingCost = (qty * pages * gsm * 18 * 0.05 )/1500 - (paperCostpad* wastage * (pages/ ups-1));
                // Note: No minimum amount was specified for this size.
            } else {
                 alert("Top Perfect Pad binding is not available for the selected paper size.");
                 return; // Stop the calculation
            }
            break;
        // END OF NEW CODE BLOCK

        case "visulate-soft-bond": // This case was in the JS but not in HTML dropdown
            if (pages <= 100) {
                bindingCost = qty * 3;
            } else if (pages <= 200) {
                bindingCost = qty * 4;
            } else {
                bindingCost = qty * 5;
            }
            bindingCost = Math.max(bindingCost, 5000);
            break;
        case "visulate-hard-bond-galy": // This case was in the JS but not in HTML dropdown
            if (pages <= 100) {
                bindingCost = qty * 5;
            } else if (pages <= 200) {
                bindingCost = qty * 6;
            } else {
                bindingCost = qty * 7;
            }
            bindingCost = Math.max(bindingCost, 7000);
            break;
        case "loop-pinning":
            if (pages <= 100) {
                bindingCost = qty * 2;
            } else if (pages <= 200) {
                bindingCost = qty * 1.5;
            } else {
                bindingCost = qty * 1.5;
            }
            bindingCost = Math.max(bindingCost, 2500);
            break;
        case "hardbound-gally-section": // APPLYING NEW FORMULAS HERE
            if (["A5", "Half-Letter"].includes(size)) {
                bindingCost = (2 * qty + wastage) + (Math.ceil(qty / 1000) / 2 * 400 + 1600) + (4 * (qty + wastage)) + (15.5 * qty) + (2 * qty) + (qty * pages * 0.08);
            } else if (["A4", "Letter"].includes(size)) {
                bindingCost = (4 * qty + wastage) + (Math.ceil(qty / 1000) * 400 + 1600) + (6 * (qty + wastage)) + (21 * qty) + (4 * qty) + (qty * pages * 0.08);
            } else if (size === "7.1x9.5") {
                bindingCost = (3 * qty + wastage) + (Math.ceil(qty / 1000) * 400 + 1600) + (5 * (qty + wastage)) + (17 * qty) + (3 * qty) + (qty * pages * 0.08);
            } else if (size === "9.5x13.5") {
                bindingCost = (4 * qty + wastage) + (Math.ceil(qty / 1000) * 400 + 1600) + (8 * (qty + wastage)) + (25 * qty) + (5 * qty) + (qty * pages * 0.08);
            } else if (["12x12", "11x11"].includes(size)) {
                bindingCost = (6 * qty + wastage) + (Math.ceil(qty / 1000) * 400 + 1600) + (8 * (qty + wastage)) + (18 * qty) + (4 * qty) + (qty * pages * 0.08);
            } else if (["8x8", "9x9"].includes(size)) {
                bindingCost = (5 * qty + wastage) + (Math.ceil(qty / 1000) * 400 + 1600) + (6 * (qty + wastage)) + (17 * qty) + (3 * qty) + (qty * pages * 0.08);
            } else {
                alert("Please select a supported paper size for Hardbound Gally Section binding.");
                return;
            }
            break;
        case "none":
        default:
            bindingCost = 0;
            break;
    }

    // --- ADDITIONAL PROCESS COSTS ---
    let uvCost = 0;
    let foilingCost = 0;
    let dripupCost = 0;

    // UV Costs
    if (uvType === "spot-uv-cover") {
        uvCost = Math.max(Math.ceil(qty / 1000) * 1800, 2000);
    } else if (uvType === "raised-uv-cover") {
        uvCost = Math.max(Math.ceil(qty / 1000) * 2300, 2700);
    } else if (uvType === "spot-uv-all-pages") {
        uvCost = (Math.ceil(qty / 1000) * 1800) * (pages / ups * 2);
    }

    // Foiling Costs
    if (foilingType === "stamp-foil-cover") {
        foilingCost = Math.max(Math.ceil(qty / 1000) * 2200, 3500);
    } else if (foilingType === "magic-gold-foil-cover") {
        foilingCost = Math.max(Math.ceil(qty / 1000) * 8000, 8000);
    }

    // DripUp Costs
    if (dripUpType === "drip-up-cover") {
        dripupCost = Math.max(Math.ceil(qty / 1000) * 5000, 6000);
    } else if (dripUpType === "drip-up-all-pages") {
        // Corrected formula for "dripUp on all page"
        const baseCost = (weight * 0.75 * (qty + wastage) / 100 ) + 1000;
        const pageFactor = ((pages + 4) / ups * 2); // This will multiply by the number of impressions per sheet of 'ups'
        dripupCost = Math.max(baseCost * pageFactor + bindingCost , 6000);
    }


    const FinalAmt = (paperCost + printingCost + laminationCost + bindingCost + coverPaperCost + coverPrintingCost + coverLaminationCost + uvCost + foilingCost + dripupCost);
    const BookletRate = FinalAmt / qty;

    document.getElementById("paper-cost").innerText = `Paper Cost: ₹ ${paperCost.toFixed(2)}`;
    document.getElementById("cover-paper-cost").innerText = `Cover Paper Cost: ₹ ${coverPaperCost.toFixed(2)}`;
    document.getElementById("printing-cost").innerText = `Printing Cost: ₹ ${printingCost.toFixed(2)}`;
    document.getElementById("cover-printing-cost").innerText = `Cover Printing Cost: ₹ ${coverPrintingCost.toFixed(2)}`;
    document.getElementById("lamination-cost").innerText = `Lamination Cost: ₹ ${laminationCost.toFixed(2)}`;
    document.getElementById("cover-lamination-cost").innerText = `Cover Lamination Cost: ₹ ${coverLaminationCost.toFixed(2)}`;
    document.getElementById("binding-cost").innerText = `Binding Cost: ₹ ${bindingCost.toFixed(2)}`;
    document.getElementById("uv-cost").innerText = `UV Cost: ₹ ${uvCost.toFixed(2)}`;
    document.getElementById("foiling-cost").innerText = `Foiling Cost: ₹ ${foilingCost.toFixed(2)}`;
    document.getElementById("dripup-cost").innerText = `DripUp Cost: ₹ ${dripupCost.toFixed(2)}`;
    
  const fields = [
    { label: "Quantity", value: document.getElementById('qty').value },
    { label: "book Size", value: document.getElementById('paper-size').value },
    { label: "Inner Pages", value:document.getElementById('pages').value + " pages, " + (document.getElementById('pages').value ) /2 + " leaves" },
    { label: "Inner GSM", value: document.getElementById('gsm').value +" GSM"},
    { label: "Printing Type", value: document.getElementById('printing-type').value  + "-color" },
    { label: "Inner Lamination / Varnish", value: document.getElementById('lamination').value +"--lamination"},
    { label: "Binding Type", value: document.getElementById('binding-type').value },
    { label: "Cover GSM", value: document.getElementById('coverGsm').value +" GSM" },
    { label: "Cover Printing Color", value: document.getElementById('coverPrintingColor').value + "-color" },
    { label: "Cover Lamination Type", value: document.getElementById('coverLamination').value +"-lamination" },
    { label: "UV", value: document.getElementById('uvType').value },
    { label: "Foiling", value: document.getElementById('foilingType').value },
    { label: "DripUp", value: document.getElementById('dripUpType').value }
  ];

  const summaryList = document.getElementById('summary-list');
  summaryList.innerHTML = '';
  fields.forEach(item => {
    if (
      item.value &&
      item.value !== "none" &&
      !item.value.startsWith("--") &&
      item.value !== "No Cover Lamination"
    ) {
      const li = document.createElement('li');
      li.textContent = `${item.label}: ${item.value}`;
      summaryList.appendChild(li);
    }
  });
    document.getElementById("Final-Amount").innerText = `Final-Amount: ₹ ${FinalAmt.toFixed(2)}`;
    document.getElementById("Final-Rate").innerText = `Final-Rate: ₹ ${BookletRate.toFixed(2)}`;
}

// Add this new code block to handle hiding/showing sections
document.addEventListener('DOMContentLoaded', function() {
    const bindingTypeSelect = document.getElementById('binding-type');
    const coverDetailsSection = document.getElementById('coverDetailsSection');

    // New elements for Additional Process section
    const toggleAdditionalProcessButton = document.getElementById('toggleAdditionalProcess');
    const additionalProcessContent = document.getElementById('additionalProcessContent');


    // Function to toggle visibility of cover section
    function toggleCoverSection() {
        if (bindingTypeSelect.value === 'hardbound-gally-section') {
            coverDetailsSection.style.display = 'none'; // Hide the section
            // Optionally, reset cover-related inputs to prevent them affecting calculation when hidden
            document.getElementById("coverGsm").value = "250";
            document.getElementById("coverPrintingColor").value = "none";
            document.getElementById("coverLamination").value = "none";
        } else {
            coverDetailsSection.style.display = ''; // Show the section (revert to default display)
        }
    }

    // Function to toggle visibility of Additional Process section
    function toggleAdditionalProcessSection() {
        // Toggle the 'show' class
        additionalProcessContent.classList.toggle('show');

        // Adjust max-height for smooth transition, or use display: block/none
        if (additionalProcessContent.classList.contains('show')) {
            // Set max-height to a value larger than the actual content height
            additionalProcessContent.style.maxHeight = additionalProcessContent.scrollHeight + "px";
        } else {
            additionalProcessContent.style.maxHeight = "0";
        }
    }


    // Add event listeners
    bindingTypeSelect.addEventListener('change', toggleCoverSection);
    toggleAdditionalProcessButton.addEventListener('click', toggleAdditionalProcessSection);

    // Call the functions once on page load to set initial state
    toggleCoverSection();
    // Initially hide additional process content by setting its max-height to 0 and ensure 'show' class is not present
    additionalProcessContent.style.maxHeight = "0";
    additionalProcessContent.classList.remove('show'); // Ensure it's hidden on load
    
});
document.addEventListener('contextmenu', event => event.preventDefault());
            document.onkeydown = function(e) {
                if (e.keyCode == 123) { return false; }
                if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; }
                if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; }
                if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { return false; }
            };
