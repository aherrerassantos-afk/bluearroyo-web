# BLUE ARROYO — Claude Code Guidelines & Info

This file provides context, rules, and pricing details for Claude Code when working on the **Blue Arroyo** codebase. Always read and respect these guidelines.

---

## 1. BUSINESS CONTEXT
*   **Company**: Blue Arroyo (Cleaning Co. / Property Management Services)
*   **Location**: Via Matteo Palmieri 20R, 50122 Firenze (Italy)
*   **Core Business**: High-end professional cleaning (pulizie post check-out) and industrial linen management (lavanderia e noleggio biancheria a standard alberghiero) for Airbnb, holiday homes, and property managers in Florence.
*   **Live Website**: [palazzobluearroyo.it](https://palazzobluearroyo.it)

---

## 2. OFFICIAL PRICING LIST (LISTINO PREZZI 2025)
All prices are **IVA included** with no weekend or holiday surcharges.

### A. Cleaning Post Check-out (Manodopera + Eco Products)
*   **25 – 40 m²** (Monolocale / bilocale piccolo): **€30.00**
*   **40 – 75 m²** (Bilocale / trilocale): **€40.00**
*   **75 – 110 m²** (Trilocale / quadrilocale): **€50.00** *(Most Popular)*
*   **110 – 145 m²** (Quadrilocale / grande): **€60.00**
*   **145 – 170 m²** (Villa / lusso): **€75.00**

### B. Linen & Laundry (Servizio Biancheria - Noleggio e Lavaggio Industriale)
*   **Letto Matrimoniale (1° letto)**: **€25.00**
    *   *Fornitura*: Lenzuola, federe e set asciugamani a seconda del numero di ospiti in ingresso.
    *   *Comprende*: 2 Lenzuola in estate (3 lenzuola in inverno), 2 federe e 1 asciugamano viso + 1 corpo per ospite.
*   **Letto Matrimoniale (Aggiuntivo)**: **€15.00** (dal 2° letto in poi)
    *   *Comprende*: Stessa dotazione del primo matrimoniale.
*   **Letto Singolo**: **€11.00** (tariffa fissa per letto)
    *   *Comprende*: 2 Lenzuola in estate (3 lenzuola in inverno), 1 federa e 1 set asciugamani (1 corpo e 1 viso) a seconda del numero di ospiti in ingresso.

### C. Divani Letto (Opzione Extra)
*   **Divano Letto Matrimoniale**: **€18.00**
*   **Divano Letto Singolo**: **€12.00**
    *   *Dettaglio*: Fornitura e preparazione su richiesta. Comprende la stessa dotazione di biancheria di un letto normale.

### D. Kit di Cortesia & Add-ons
*   **Kit Cucina**: **€0.00 / Incluso gratis**
    *   *Contenuto*: Pastiglie lavastoviglie, sapone piatti, spugnetta nuova, buste spazzatura. Monouso sigillato. **Sempre incluso in ogni preventivo base.**
*   **Kit Bagno Extra**: **€3.00** (per ogni bagno aggiuntivo)
    *   *Contenuto*: 2 rotoli di carta igienica, 1 sapone mani con dispenser, 2 shampoo monouso e il tappeto doccia. *(Il 1° kit bagno è già incluso nel prezzo base).*
*   **Spolverata / Riassetto**: **Su Richiesta** (Tariffe personalizzate)
    *   *Regola*: Calcolato soltanto se il cliente usufruisce già del servizio base di pulizia check-out con biancheria.

---

## 3. TECHNICAL ARCHITECTURE & STYLING
*   **Stack**: Vanilla HTML5, Vanilla JavaScript (ES5/ES6 compatible), and Vanilla CSS. No Tailwind CSS or complex bundlers.
*   **Styling**: Follows the luxury-minimalist aesthetic inspired by *mmega.com*. Main design system tokens are defined in [shared.css](file:///Users/andresjulianherrerasantos/Desktop/bluearroyo-web/shared.css).
    *   *Colors*: White background (`#FFFFFF`), charcoal text (`#1A1A18`), gold accents (`#B8965A` / `#C6A96B`), and alternating soft background sections (`#F6F5F2`).
    *   *Typography*: Jost (sans-serif) for body text and Cormorant Garamond (serif) for premium luxury headers and italic accents.

---

## 4. CODE GUIDELINES & ESTIMATE CALCULATOR LOGIC
When editing the interactive quote calculator or pages:
1.  **Duo Synchronization**: The JavaScript for the quote calculator is duplicated in two places:
    *   The homepage widget in [index.html](file:///Users/andresjulianherrerasantos/Desktop/bluearroyo-web/index.html)
    *   The dedicated page in [preventivo.html](file:///Users/andresjulianherrerasantos/Desktop/bluearroyo-web/preventivo.html)
    *   *Rule*: Always update the calculator JS methods (`calcQuote`, `showSummary`, `exportPDF`, `showBagniSenza`) in **BOTH** files identically to maintain consistent prices.
2.  **No Kit Cucina Prompts**: Do not ask the user if they want to add the kitchen kit. Auto-include it to the calculations in `calcQuote()` with a price of €0 (Incluso).
3.  **Linen Details in Notes**: The note block on the final quote summary, printed PDF, and WhatsApp/Email text must list the exact composition of beds (2 lenzuola in estate / 3 in inverno, federe, asciugamani per ospite).
4.  **Email CC Administration Copy**: The email `mailto:` link option in the final step must prefill the client's email address in the `To` field and **must copy `admin@bluearroyo.it` in the `Cc` parameter** (`?cc=admin@bluearroyo.it`).

---

## 5. REPOSITORY COMMANDS

### Run Dev Server Locally
To start the local HTTP server on port 8080:
```bash
python3 -m http.server 8080
```
Then visit: `http://localhost:8080/preventivo.html`

### Deploy to Production
To push changes live to the production Vercel site:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
