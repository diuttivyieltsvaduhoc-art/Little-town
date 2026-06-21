// =============================================
// LITTLE TOWN - UI.JS
// Character, pet, house SVG rendering + animations
// =============================================

const UI = {
  getHairClipY(headId) {
    if (!headId) return 15;
    if (headId === 'head_cap_red' || headId.startsWith('head_gen_')) return 17;
    if (headId === 'head_beanie') return 20;
    if (headId === 'head_graduation') return 14;
    if (headId === 'head_witch') return 22;
    if (headId === 'head_straw_hat') return 24;
    if (headId === 'head_chef_hat') return 18;
    return 15;
  },

  getAccessoryColor(id, defaultColor = '#3498DB') {
    if (!id) return defaultColor;
    if (typeof GAME_DATA === 'undefined' || !GAME_DATA.shops) return defaultColor;
    const item = GAME_DATA.shops.accessories.items.find(i => i.id === id);
    return item?.color || defaultColor;
  },

  // ---- CHARACTER RENDERING ----
  renderCharacter(gender, styleId, outfit, size = 80, animate = true) {
    const style = CHARACTER_STYLES[gender]?.find(s => s.id === styleId) || CHARACTER_STYLES[gender]?.[0];
    if (!style) return '';
    
    // Get outfit colors
    const outfitData = this.getOutfitColors(outfit);
    
    const walkClass = animate ? 'char-walk' : 'static-sprite';
    const skinColor = style.skin;
    const hairColor = style.hair;
    const scale = size / 80;
    
    return `
    <div class="character-sprite ${walkClass}" style="width:${size}px;height:${size}px;position:relative;">
      <svg viewBox="0 0 80 100" width="${size}" height="${size * 1.25}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="hood-face-clip">
            <rect x="18" y="9" width="44" height="48" rx="5"/>
          </clipPath>
          ${outfit && outfit.head ? `
          <clipPath id="hat-hair-clip-${outfit.head}">
            <rect x="15" y="${this.getHairClipY(outfit.head)}" width="50" height="50" rx="2"/>
          </clipPath>
          ` : ''}
        </defs>
        <!-- Shadow -->
        <ellipse cx="40" cy="98" rx="15" ry="3" fill="rgba(0,0,0,0.2)"/>
        
        <!-- Background Accessories (wings, cape, tail) -->
        ${this.renderBackgroundAccessories(outfit)}

        <!-- Body/Clothes -->
        ${this.renderTop(outfitData, outfit, skinColor)}
        
        <!-- Hands -->
        <circle cx="20" cy="67" r="5" fill="${skinColor}" class="char-arm-l"/>
        <circle cx="60" cy="67" r="5" fill="${skinColor}" class="char-arm-r"/>
        
        <!-- Pants/Skirt -->
        ${this.renderBottom(gender, styleId, outfitData, outfit, skinColor)}
        
        <!-- Shoes -->
        ${this.renderShoes(outfitData, outfit)}
        
        <!-- Neck -->
        <rect x="34" y="36" width="12" height="8" rx="2" fill="${skinColor}"/>
        
        <!-- Head / Hood -->
        ${!outfit || !outfit.head ? `
          <!-- Ears -->
          <polygon points="20,14 26,0 34,16" fill="#FAF9F6"/>
          <polygon points="60,14 54,0 46,16" fill="#FAF9F6"/>
          <polygon points="22,13 26,2.5 32,15" fill="#FDF0ED"/>
          <polygon points="58,13 54,2.5 48,15" fill="#FDF0ED"/>
          <!-- Hood base -->
          <circle cx="40" cy="26" r="18.5" fill="#FAF9F6"/>
          <!-- Face skin -->
          <circle cx="40" cy="26.5" r="16.5" fill="${skinColor}"/>
        ` : `
          <!-- Normal Head -->
          <circle cx="40" cy="26" r="18" fill="${skinColor}"/>
        `}
        
        <!-- Hair -->
        ${!outfit || !outfit.head ? `
          <g clip-path="url(#hood-face-clip)">
            ${this.renderHair(gender, styleId, hairColor)}
          </g>
        ` : (['head_earmuffs', 'head_ribbon_band', 'head_crown', 'head_crown_ice'].includes(outfit.head) ? this.renderHair(gender, styleId, hairColor) : `
          <g clip-path="url(#hat-hair-clip-${outfit.head})">
            ${this.renderHair(gender, styleId, hairColor)}
          </g>
        `)}
        
        <!-- Cute Flat Eyebrows -->
        <path d="M29 18 Q33 16.5 37 18" stroke="#3D2B1F" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.4"/>
        <path d="M43 18 Q47 16.5 51 18" stroke="#3D2B1F" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.4"/>
        
        <!-- Cute Flat Oval Eyes (Cozy Style) -->
        <ellipse cx="33" cy="24" rx="2.8" ry="4" fill="#3D2B1F"/>
        <ellipse cx="47" cy="24" rx="2.8" ry="4" fill="#3D2B1F"/>
        
        <!-- Simple Cute Smile -->
        <path d="M37 29.5 Q40 32 43 29.5" stroke="#3D2B1F" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        
        <!-- Cute Soft Cozy Blush -->
        <ellipse cx="27" cy="28" rx="4.8" ry="2.8" fill="rgba(253,142,142,0.45)"/>
        <ellipse cx="53" cy="28" rx="4.8" ry="2.8" fill="rgba(253,142,142,0.45)"/>
        
        <!-- Headwear overlay -->
        ${this.renderHeadwear(outfit)}

        <!-- Foreground accessories overlay -->
        ${this.renderForegroundAccessories(outfit, skinColor)}
      </svg>
    </div>`;
  },

  renderBackgroundAccessories(outfit) {
    if (!outfit) return '';
    let svg = '';
    // Cape
    if (outfit.top === 'top_cape') {
      svg += `<path d="M22 42 L10 90 L70 90 L58 42 Z" fill="#6A0DAD" opacity="0.9"/>`;
    }
    // Wings
    if (outfit.back === 'acc_wings') {
      svg += `<!-- Fairy Wings -->
              <path d="M28 45 Q5 15 15 50 Q5 70 28 60 Z" fill="#E8F5E9" stroke="#A5D6A7" stroke-width="1" opacity="0.8"/>
              <path d="M52 45 Q75 15 65 50 Q75 70 52 60 Z" fill="#E8F5E9" stroke="#A5D6A7" stroke-width="1" opacity="0.8"/>`;
    }
    // Tail
    if (outfit.back === 'acc_tail') {
      svg += `<!-- Fox Tail -->
              <path d="M54 75 Q75 70 70 50 Q65 40 56 65 Z" fill="#FF8C42" stroke="#E67E22" stroke-width="1"/>
              <path d="M68 53 Q70 50 66 47 Z" fill="white"/>`; // white tip
    }
    // Bat Wings
    if (outfit.back === 'acc_wings_bat') {
      svg += `<!-- Bat Wings -->
              <path d="M28 45 L5 30 L15 55 L8 60 L24 55 Z" fill="#1C2833"/>
              <path d="M52 45 L75 30 L65 55 L72 60 L56 55 Z" fill="#1C2833"/>`;
    }
    // Angel Wings
    if (outfit.back === 'acc_wings_angel') {
      svg += `<!-- Angel Wings -->
              <path d="M28 45 Q5 20 12 52 Q5 65 28 58 Z" fill="#FFF" stroke="#E5E7E9" stroke-width="1" opacity="0.95"/>
              <path d="M52 45 Q75 20 68 52 Q75 65 52 58 Z" fill="#FFF" stroke="#E5E7E9" stroke-width="1" opacity="0.95"/>`;
    }
    // Red Cape
    if (outfit.back === 'acc_cape_red') {
      svg += `<!-- Red Cape -->
              <path d="M22 42 L8 92 L72 92 L58 42 Z" fill="#C0392B" opacity="0.95"/>`;
    }
    // Toy Shield
    if (outfit.back === 'acc_shield_toy') {
      svg += `<!-- Toy Shield on back -->
              <circle cx="20" cy="55" r="9" fill="#CD853F" stroke="#8B5A2B" stroke-width="2"/>
              <polygon points="20,49 22,53 26,53 23,55 24,59 20,57 16,59 17,55 14,53 18,53" fill="#FFD700"/>`;
    }
    // Toy Guitar
    if (outfit.back === 'acc_guitar_toy') {
      svg += `<!-- Toy Guitar on back -->
              <path d="M15 75 L30 55 L26 52 L12 72 Z" fill="#D2691E" stroke="#5D4037" stroke-width="1"/>
              <line x1="28" y1="53" x2="48" y2="30" stroke="#7F8C8D" stroke-width="1.5"/>`;
    } else if (outfit.back && outfit.back.startsWith('acc_gen_')) {
      const color = this.getAccessoryColor(outfit.back, '#AED6F1');
      svg += `<!-- Fallback Wings -->
              <path d="M28 45 Q5 15 15 50 Q5 70 28 60 Z" fill="${color}" stroke="${color}" stroke-dasharray="1 1" stroke-width="1" opacity="0.6"/>
              <path d="M52 45 Q75 15 65 50 Q75 70 52 60 Z" fill="${color}" stroke="${color}" stroke-dasharray="1 1" stroke-width="1" opacity="0.6"/>`;
    }
    return svg;
  },

  renderTop(outfitData, outfit, skinColor) {
    const defaultTop = `<!-- Cream A-line Dress -->
                        <path d="M26 42 L54 42 L60 78 L20 78 Z" fill="#FAF9F6"/>
                        <!-- Brown Backpack Straps -->
                        <rect x="26" y="42" width="4.5" height="22" fill="#7B4B36" rx="1"/>
                        <rect x="49.5" y="42" width="4.5" height="22" fill="#7B4B36" rx="1"/>
                        <!-- Cream Dress Sleeves -->
                        <rect x="15" y="44" width="11" height="22" rx="5.5" fill="#FAF9F6" class="char-arm-l"/>
                        <rect x="54" y="44" width="11" height="22" rx="5.5" fill="#FAF9F6" class="char-arm-r"/>
                        <!-- Yellow Neck Ornament Tag -->
                        <line x1="40" y1="42" x2="40" y2="52" stroke="#7B4B36" stroke-width="1.5"/>
                        <rect x="36" y="52" width="8" height="11" rx="1.5" fill="#FED766"/>
                        <circle cx="40" cy="55.5" r="1.2" fill="#3D2B1F"/>`;
    if (!outfit || !outfit.top) return defaultTop;
    
    const id = outfit.top;
    const color = outfitData.topColor;
    
    let bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>`;
    let armsSvg = `<rect x="15" y="44" width="11" height="22" rx="5" fill="${color}" class="char-arm-l"/>
                   <rect x="54" y="44" width="11" height="22" rx="5" fill="${color}" class="char-arm-r"/>`;
                   
    if (id === 'top_tshirt_white' || id === 'top_tshirt_blue') {
      // Short sleeves: top 10px is colored, rest is skinColor
      armsSvg = `<!-- Left Arm (Short Sleeve) -->
                 <rect x="15" y="44" width="11" height="10" rx="2" fill="${color}" class="char-arm-l"/>
                 <rect x="15" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-l"/>
                 <!-- Right Arm (Short Sleeve) -->
                 <rect x="54" y="44" width="11" height="10" rx="2" fill="${color}" class="char-arm-r"/>
                 <rect x="54" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-r"/>`;
    } else if (id === 'top_tanktop_white') {
      // Tank top: body has cutouts, arms are skinColor
      bodySvg = `<path d="M28 42 L52 42 L54 48 L54 72 L26 72 L26 48 Z" fill="${color}"/>`;
      armsSvg = `<rect x="15" y="44" width="11" height="22" rx="5" fill="${skinColor}" class="char-arm-l"/>
                 <rect x="54" y="44" width="11" height="22" rx="5" fill="${skinColor}" class="char-arm-r"/>`;
    } else if (id === 'top_hoodie_grey' || id === 'top_hoodie_pink') {
      // Hoodie: add hood outline at neck & big pocket on front
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <!-- Hood folds -->
                 <ellipse cx="40" cy="42" rx="12" ry="5" fill="${color}" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                 <!-- Pocket -->
                 <path d="M32 60 L48 60 L46 70 L34 70 Z" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>`;
    } else if (id === 'top_shirt_school') {
      // School Shirt: white shirt, collar, red tie
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <!-- Collar -->
                 <polygon points="32,42 40,49 48,42" fill="white" stroke="#DDD" stroke-width="1"/>
                 <!-- Tie -->
                 <polygon points="39,49 41,49 42,65 40,68 38,65" fill="#E74C3C"/>`;
      // Short sleeves
      armsSvg = `<rect x="15" y="44" width="11" height="10" rx="2" fill="${color}" class="char-arm-l"/>
                 <rect x="15" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-l"/>
                 <rect x="54" y="44" width="11" height="10" rx="2" fill="${color}" class="char-arm-r"/>
                 <rect x="54" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-r"/>`;
    } else if (id === 'top_blazer_navy') {
      // Blazer: dark navy, golden buttons, white shirt peeking out
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <!-- White shirt V-neck -->
                 <polygon points="35,42 40,54 45,42" fill="white"/>
                 <line x1="40" y1="54" x2="40" y2="72" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
                 <!-- Gold buttons -->
                 <circle cx="36" cy="58" r="1.5" fill="#FFD700"/>
                 <circle cx="36" cy="64" r="1.5" fill="#FFD700"/>`;
    } else if (id === 'top_sport_red' || id === 'top_sport_green') {
      // Sport Jersey: white stripes on shoulders, number 10
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <!-- Stripes -->
                 <line x1="28" y1="42" x2="28" y2="72" stroke="white" stroke-width="2"/>
                 <line x1="52" y1="42" x2="52" y2="72" stroke="white" stroke-width="2"/>
                 <!-- Number -->
                 <text x="40" y="60" font-size="10" font-weight="900" fill="white" text-anchor="middle" font-family="Arial">10</text>`;
      // Short sleeves
      armsSvg = `<rect x="15" y="44" width="11" height="12" rx="2" fill="${color}" class="char-arm-l"/>
                 <rect x="15" y="56" width="11" height="10" rx="2" fill="${skinColor}" class="char-arm-l"/>
                 <rect x="54" y="44" width="11" height="12" rx="2" fill="${color}" class="char-arm-r"/>
                 <rect x="54" y="56" width="11" height="10" rx="2" fill="${skinColor}" class="char-arm-r"/>`;
    } else if (id === 'top_dress_summer') {
      // Summer Dress: yellow, sleeveless, extends down
      bodySvg = `<path d="M28 42 L52 42 L55 75 L25 75 Z" fill="${color}"/>`;
      armsSvg = `<rect x="15" y="44" width="11" height="22" rx="5" fill="${skinColor}" class="char-arm-l"/>
                 <rect x="54" y="44" width="11" height="22" rx="5" fill="${skinColor}" class="char-arm-r"/>`;
    } else if (id === 'top_dress_floral') {
      // Floral Dress: pink, cute sleeves, flower prints
      bodySvg = `<path d="M28 42 L52 42 L56 75 L24 75 Z" fill="${color}"/>
                 <!-- Flowers -->
                 <circle cx="32" cy="50" r="2.5" fill="#FFF"/>
                 <circle cx="32" cy="50" r="1" fill="#FFD700"/>
                 <circle cx="48" cy="52" r="2.5" fill="#FFF"/>
                 <circle cx="48" cy="52" r="1" fill="#FFD700"/>
                 <circle cx="40" cy="62" r="2.5" fill="#FFF"/>
                 <circle cx="40" cy="62" r="1" fill="#FFD700"/>
                 <circle cx="34" cy="68" r="2.5" fill="#FFF"/>
                 <circle cx="34" cy="68" r="1" fill="#FFD700"/>`;
      // Short puffed sleeves
      armsSvg = `<rect x="14" y="44" width="13" height="10" rx="4" fill="${color}" class="char-arm-l"/>
                 <rect x="15" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-l"/>
                 <rect x="53" y="44" width="13" height="10" rx="4" fill="${color}" class="char-arm-r"/>
                 <rect x="54" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-r"/>`;
    } else if (id === 'top_sweater_xmas') {
      // Xmas Sweater: red with green pattern
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <!-- Green snowflake/stripes pattern -->
                 <rect x="26" y="52" width="28" height="4" fill="#2ECC71"/>
                 <rect x="26" y="60" width="28" height="4" fill="#2ECC71"/>
                 <line x1="40" y1="52" x2="40" y2="64" stroke="#FFF" stroke-width="1.5"/>`;
    } else if (id === 'top_kimono' || id === 'top_yukata') {
      // Kimono / Yukata: wrap style, obi belt
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <!-- Collar fold -->
                 <line x1="28" y1="42" x2="40" y2="56" stroke="white" stroke-width="2"/>
                 <line x1="52" y1="42" x2="40" y2="56" stroke="white" stroke-width="2"/>
                 <!-- Obi Belt -->
                 <rect x="26" y="58" width="28" height="8" fill="#FFD700"/>
                 <rect x="36" y="58" width="8" height="8" fill="#C0392B"/>`;
      // Wide sleeves
      armsSvg = `<rect x="12" y="44" width="15" height="18" rx="3" fill="${color}" class="char-arm-l"/>
                 <circle cx="20" cy="65" r="4" fill="${skinColor}" class="char-arm-l"/>
                 <rect x="53" y="44" width="15" height="18" rx="3" fill="${color}" class="char-arm-r"/>
                 <circle cx="60" cy="65" r="4" fill="${skinColor}" class="char-arm-r"/>`;
    } else if (id === 'top_jacket_leather') {
      // Leather jacket: black, silver zipper line
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <!-- Silver zipper -->
                 <line x1="40" y1="42" x2="40" y2="72" stroke="#BDC3C7" stroke-width="2" stroke-dasharray="2 1"/>`;
    } else if (id === 'top_polo_stripe') {
      // Polo Stripe: horizontal stripes
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <!-- White stripes -->
                 <rect x="26" y="48" width="28" height="3" fill="#FFF"/>
                 <rect x="26" y="56" width="28" height="3" fill="#FFF"/>
                 <rect x="26" y="64" width="28" height="3" fill="#FFF"/>`;
      // Short sleeves
      armsSvg = `<rect x="15" y="44" width="11" height="10" rx="2" fill="${color}" class="char-arm-l"/>
                 <rect x="15" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-l"/>
                 <rect x="54" y="44" width="11" height="10" rx="2" fill="${color}" class="char-arm-r"/>
                 <rect x="54" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-r"/>`;
    } else if (id === 'top_cardigan') {
      // Cardigan: open cardigan showing white shirt inside
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <!-- White inner shirt -->
                 <polygon points="34,42 40,58 46,42" fill="white"/>`;
    } else if (id === 'top_armor') {
      // Armor: gold shiny breastplate
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}" stroke="#D4AF37" stroke-width="2"/>
                 <!-- Red gemstone on chest -->
                 <polygon points="40,50 43,54 40,58 37,54" fill="#E74C3C"/>
                 <!-- Shoulder pads -->
                 <path d="M23 40 Q30 38 30 45 Z" fill="#D4AF37"/>
                 <path d="M57 40 Q50 38 50 45 Z" fill="#D4AF37"/>`;
    } else if (id === 'top_shirt_denim' || id === 'top_jacket_denim') {
      // Denim shirt/jacket: blue denim with small brown stitching lines/buttons
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <line x1="40" y1="42" x2="40" y2="72" stroke="#8B5A2B" stroke-width="1.5"/>
                 <circle cx="37" cy="52" r="1" fill="#8B5A2B"/>
                 <circle cx="37" cy="62" r="1" fill="#8B5A2B"/>`;
    } else if (id === 'top_sweater_yellow' || id === 'top_sweater_stripes' || id === 'top_sweater_bear') {
      // Sweaters: yellow, stripes, or bear print
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>`;
      if (id === 'top_sweater_stripes') {
        bodySvg += `<rect x="26" y="48" width="28" height="4" fill="#2C3E50"/>
                    <rect x="26" y="58" width="28" height="4" fill="#2C3E50"/>`;
      } else if (id === 'top_sweater_bear') {
        bodySvg += `<circle cx="40" cy="56" r="6" fill="#FFF"/>
                    <circle cx="38" cy="55" r="1" fill="#000"/>
                    <circle cx="42" cy="55" r="1" fill="#000"/>
                    <path d="M38 58 Q40 60 42 58" stroke="#000" stroke-width="0.8" fill="none"/>`;
      }
    } else if (id === 'top_vest_formal' || id === 'top_vest_light') {
      // Formal vest / Light vest: V-neck, necktie/bowtie, buttons
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <polygon points="34,42 40,54 46,42" fill="white"/>`;
      if (id === 'top_vest_formal') {
        bodySvg += `<polygon points="38,44 42,44 40,49" fill="#E74C3C"/> <!-- Red bowtie -->`;
      } else {
        bodySvg += `<line x1="40" y1="42" x2="40" y2="72" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>`;
      }
      bodySvg += `<circle cx="40" cy="56" r="1.5" fill="#111"/>
                  <circle cx="40" cy="62" r="1.5" fill="#111"/>`;
    } else if (id === 'top_dress_princess' || id === 'top_dress_party' || id === 'top_dress_gothic') {
      // Princess/Party/Gothic Dress: sleeveless/short sleeves, extends down to bottom
      bodySvg = `<path d="M28 42 L52 42 L56 78 L24 78 Z" fill="${color}"/>`;
      armsSvg = `<rect x="15" y="44" width="11" height="18" rx="4" fill="${skinColor}" class="char-arm-l"/>
                 <rect x="54" y="44" width="11" height="18" rx="4" fill="${skinColor}" class="char-arm-r"/>`;
      if (id === 'top_dress_princess') {
        bodySvg += `<path d="M24 70 Q40 85 56 70" fill="none" stroke="#FFF" stroke-width="2"/>`;
      }
    } else if (id === 'top_jersey_basketball' || id === 'top_jersey_soccer') {
      // Sports Jersey: tanktop cut or t-shirt cut, numbers
      if (id === 'top_jersey_basketball') {
        bodySvg = `<path d="M28 42 L52 42 L54 48 L54 72 L26 72 L26 48 Z" fill="${color}"/>
                   <text x="40" y="60" font-size="10" font-weight="bold" fill="white" text-anchor="middle" font-family="monospace">23</text>`;
        armsSvg = `<rect x="15" y="44" width="11" height="22" rx="5" fill="${skinColor}" class="char-arm-l"/>
                   <rect x="54" y="44" width="11" height="22" rx="5" fill="${skinColor}" class="char-arm-r"/>`;
      } else {
        bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                   <circle cx="40" cy="56" r="7" fill="white" opacity="0.8"/>
                   <text x="40" y="60" font-size="9" font-weight="bold" fill="${color}" text-anchor="middle">7</text>`;
        armsSvg = `<rect x="15" y="44" width="11" height="10" rx="2" fill="${color}" class="char-arm-l"/>
                   <rect x="15" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-l"/>
                   <rect x="54" y="44" width="11" height="10" rx="2" fill="${color}" class="char-arm-r"/>
                   <rect x="54" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-r"/>`;
      }
    } else if (id === 'top_jacket_down' || id === 'top_jacket_bomber') {
      // Puffy jacket / Bomber: puff lines or contrasting collars/hems
      bodySvg = `<rect x="25" y="41" width="30" height="31" rx="5" fill="${color}"/>`;
      if (id === 'top_jacket_down') {
        bodySvg += `<line x1="25" y1="50" x2="55" y2="50" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
                    <line x1="25" y1="60" x2="55" y2="60" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>`;
      } else {
        bodySvg += `<rect x="25" y="41" width="30" height="4" fill="#2C3E50"/>
                    <rect x="25" y="68" width="30" height="4" fill="#2C3E50"/>`;
      }
    } else if (id === 'top_tshirt_cat' || id === 'top_tshirt_star' || id === 'top_tshirt_heart') {
      // Cute print T-shirts
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>`;
      if (id === 'top_tshirt_cat') {
        bodySvg += `<circle cx="40" cy="56" r="4" fill="#555"/>
                    <polygon points="36,54 35,50 39,53" fill="#555"/>
                    <polygon points="44,54 45,50 41,53" fill="#555"/>`;
      } else if (id === 'top_tshirt_star') {
        bodySvg += `<polygon points="40,48 42,53 47,53 43,56 45,61 40,58 35,61 37,56 33,53 38,53" fill="#F1C40F"/>`;
      } else {
        bodySvg += `<path d="M37 50 A2.5 2.5 0 0 1 40 52 A2.5 2.5 0 0 1 43 50 L40 56 Z" fill="#E74C3C"/>`;
      }
      armsSvg = `<rect x="15" y="44" width="11" height="10" rx="2" fill="${color}" class="char-arm-l"/>
                 <rect x="15" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-l"/>
                 <rect x="54" y="44" width="11" height="10" rx="2" fill="${color}" class="char-arm-r"/>
                 <rect x="54" y="54" width="11" height="12" rx="2" fill="${skinColor}" class="char-arm-r"/>`;
    } else if (id === 'top_hoodie_ninja') {
      // Ninja Hoodie: black hooded, red band
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <rect x="26" y="42" width="28" height="6" fill="#C0392B"/>
                 <ellipse cx="40" cy="42" rx="10" ry="4" fill="${color}"/>`;
    } else if (id === 'top_blouse_lace') {
      // Lace blouse: white lace details
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <path d="M26 46 Q40 52 54 46" fill="none" stroke="#FFF" stroke-width="2" stroke-dasharray="2 1"/>`;
    } else if (id === 'top_kimono_sakura') {
      // Sakura Kimono: pink with cherry blossom prints
      bodySvg = `<rect x="26" y="42" width="28" height="30" rx="4" fill="${color}"/>
                 <line x1="28" y1="42" x2="40" y2="56" stroke="white" stroke-width="2"/>
                 <line x1="52" y1="42" x2="40" y2="56" stroke="white" stroke-width="2"/>
                 <rect x="26" y="58" width="28" height="8" fill="#FF8AAE"/>
                 <circle cx="31" cy="50" r="2" fill="#FFF"/>
                 <circle cx="48" cy="64" r="2" fill="#FFF"/>`;
      armsSvg = `<rect x="12" y="44" width="15" height="18" rx="3" fill="${color}" class="char-arm-l"/>
                 <circle cx="20" cy="65" r="4" fill="${skinColor}" class="char-arm-l"/>
                 <rect x="53" y="44" width="15" height="18" rx="3" fill="${color}" class="char-arm-r"/>
                 <circle cx="60" cy="65" r="4" fill="${skinColor}" class="char-arm-r"/>`;
    }
    
    return bodySvg + armsSvg;
  },

  renderBottom(gender, styleId, outfitData, outfit, skinColor) {
    const isFemale = gender === 'female';
    const isGirl3 = styleId === 'girl_3';
    
    // Default bottom
    const defaultBottom = isFemale && !isGirl3 ? 
      `<path d="M26 70 Q29 85 36 90 Q40 93 44 90 Q51 85 54 70 Z" fill="${outfitData.bottomColor}"/>` :
      `<rect x="27" y="70" width="11" height="24" rx="4" fill="${outfitData.bottomColor}" class="char-leg-l"/>
       <rect x="42" y="70" width="11" height="24" rx="4" fill="${outfitData.bottomColor}" class="char-leg-r"/>`;
       
    if (!outfit || !outfit.bottom) {
      // Nếu mặc váy mặc định (không có top) hoặc mặc váy mua trong shop, ẩn phần bottom
      if (!outfit || !outfit.top || (outfit.top && (outfit.top.includes('dress') || outfit.top.includes('kimono') || outfit.top.includes('yukata')))) {
        return '';
      }
      return defaultBottom;
    }
    
    const id = outfit.bottom;
    const color = outfitData.bottomColor;
    
    // Check if dress or robe covers bottom
    if (outfit.top && (outfit.top.includes('dress') || outfit.top.includes('kimono') || outfit.top.includes('yukata'))) {
      return '';
    }
    
    if (id === 'bot_shorts_red' || id === 'bot_shorts_denim') {
      // Short pants: top part of leg is colored, bottom part is skinColor
      return `<!-- Shorts -->
              <rect x="27" y="70" width="11" height="10" rx="1" fill="${color}" class="char-leg-l"/>
              <rect x="42" y="70" width="11" height="10" rx="1" fill="${color}" class="char-leg-r"/>
              <!-- Bare legs -->
              <rect x="27" y="80" width="11" height="14" rx="1" fill="${skinColor}" class="char-leg-l"/>
              <rect x="42" y="80" width="11" height="14" rx="1" fill="${skinColor}" class="char-leg-r"/>`;
    } else if (id === 'bot_skirt_plaid') {
      // Plaid skirt: flared pleated shape with lines
      return `<path d="M24 70 L56 70 L60 86 L20 86 Z" fill="${color}"/>
              <!-- Plaid lines -->
              <line x1="28" y1="70" x2="25" y2="86" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
              <line x1="36" y1="70" x2="35" y2="86" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
              <line x1="44" y1="70" x2="45" y2="86" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
              <line x1="52" y1="70" x2="55" y2="86" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
              <!-- Legs under skirt -->
              <rect x="29" y="86" width="7" height="8" fill="${skinColor}" class="char-leg-l"/>
              <rect x="44" y="86" width="7" height="8" fill="${skinColor}" class="char-leg-r"/>`;
    } else if (id === 'bot_skirt_tutu') {
      // Tutu Skirt: very puffy pink
      return `<path d="M22 70 L58 70 Q66 82 58 84 Q40 86 22 84 Q14 82 22 70 Z" fill="${color}" opacity="0.95"/>
              <!-- Layers -->
              <path d="M24 73 L56 73 Q62 80 56 81 Q40 82 24 81 Q18 80 24 73 Z" fill="#FFF" opacity="0.5"/>
              <!-- Legs under tutu -->
              <rect x="29" y="84" width="7" height="10" fill="${skinColor}" class="char-leg-l"/>
              <rect x="44" y="84" width="7" height="10" fill="${skinColor}" class="char-leg-r"/>`;
    } else if (id === 'bot_skirt_mini' || id === 'bot_flare') {
      // Mini skirt / Flare skirt
      return `<path d="M25 70 L55 70 L58 82 L22 82 Z" fill="${color}"/>
              <!-- Legs under -->
              <rect x="29" y="82" width="7" height="12" fill="${skinColor}" class="char-leg-l"/>
              <rect x="44" y="82" width="7" height="12" fill="${skinColor}" class="char-leg-r"/>`;
    } else if (id === 'bot_shorts_sport' || id === 'bot_shorts_khaki') {
      // Shorts: same as red shorts
      return `<rect x="27" y="70" width="11" height="8" rx="1" fill="${color}" class="char-leg-l"/>
              <rect x="42" y="70" width="11" height="8" rx="1" fill="${color}" class="char-leg-r"/>
              <rect x="27" y="78" width="11" height="16" rx="1" fill="${skinColor}" class="char-leg-l"/>
              <rect x="42" y="78" width="11" height="16" rx="1" fill="${skinColor}" class="char-leg-r"/>`;
    } else if (id === 'bot_skirt_long' || id === 'bot_skirt_jeans' || id === 'bot_skirt_lace' || id === 'bot_skirt_pleated_pink') {
      // Skirts extending further down
      let height = id === 'bot_skirt_long' ? 90 : 84;
      let skirtBody = `<path d="M25 70 L55 70 L59 ${height} L21 ${height} Z" fill="${color}"/>`;
      if (id === 'bot_skirt_lace') {
        skirtBody += `<path d="M21 84 Q40 88 59 84" fill="none" stroke="#FFF" stroke-width="1.5" stroke-dasharray="2 1"/>`;
      }
      return `${skirtBody}
              <rect x="29" y="${height}" width="7" height="${94 - height}" fill="${skinColor}" class="char-leg-l"/>
              <rect x="44" y="${height}" width="7" height="${94 - height}" fill="${skinColor}" class="char-leg-r"/>`;
    } else if (id === 'bot_pants_ninja') {
      // Ninja pants: tight with red leg wraps
      return `<rect x="27" y="70" width="11" height="24" rx="4" fill="${color}" class="char-leg-l"/>
              <rect x="42" y="70" width="11" height="24" rx="4" fill="${color}" class="char-leg-r"/>
              <line x1="27" y1="80" x2="38" y2="84" stroke="#E74C3C" stroke-width="1.5" class="char-leg-l"/>
              <line x1="42" y1="80" x2="53" y2="84" stroke="#E74C3C" stroke-width="1.5" class="char-leg-r"/>`;
    } else if (id === 'bot_pants_overalls') {
      // Overalls: bib part extending to chest
      return `<rect x="26" y="55" width="28" height="15" fill="${color}"/>
              <line x1="27" y1="42" x2="27" y2="55" stroke="${color}" stroke-width="3"/>
              <line x1="53" y1="42" x2="53" y2="55" stroke="${color}" stroke-width="3"/>
              <rect x="27" y="70" width="11" height="24" rx="4" fill="${color}" class="char-leg-l"/>
              <rect x="42" y="70" width="11" height="24" rx="4" fill="${color}" class="char-leg-r"/>`;
    } else if (id === 'bot_pants_snow') {
      // Snow pants: puffy pants
      return `<rect x="25" y="70" width="14" height="24" rx="5" fill="${color}" class="char-leg-l"/>
              <rect x="41" y="70" width="14" height="24" rx="5" fill="${color}" class="char-leg-r"/>`;
    } else if (id === 'bot_pants_linen') {
      // Wide linen pants
      return `<rect x="24" y="70" width="13" height="24" rx="2" fill="${color}" class="char-leg-l"/>
              <rect x="43" y="70" width="13" height="24" rx="2" fill="${color}" class="char-leg-r"/>`;
    }
    
    // Default long pants
    return `<rect x="27" y="70" width="11" height="24" rx="4" fill="${color}" class="char-leg-l"/>
            <rect x="42" y="70" width="11" height="24" rx="4" fill="${color}" class="char-leg-r"/>`;
  },

  renderShoes(outfitData, outfit) {
    const defaultShoes = `<ellipse cx="30" cy="93" rx="8" ry="5" fill="${outfitData.shoesColor}" class="char-leg-l"/>
                          <ellipse cx="50" cy="93" rx="8" ry="5" fill="${outfitData.shoesColor}" class="char-leg-r"/>`;
    if (!outfit || !outfit.shoes) return defaultShoes;
    
    const id = outfit.shoes;
    const color = outfitData.shoesColor;
    
    if (id === 'shoe_sneaker_white' || id === 'shoe_sneaker_red' || id === 'shoe_running') {
      // Sneakers with white laces details
      return `<!-- Left Sneaker -->
              <ellipse cx="30" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-l"/>
              <rect x="26" y="90" width="8" height="2" fill="white" class="char-leg-l"/>
              <rect x="28" y="92" width="4" height="2" fill="white" class="char-leg-l"/>
              <!-- Right Sneaker -->
              <ellipse cx="50" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-r"/>
              <rect x="46" y="90" width="8" height="2" fill="white" class="char-leg-r"/>
              <rect x="48" y="92" width="4" height="2" fill="white" class="char-leg-r"/>`;
    } else if (id === 'shoe_boots_brown' || id === 'shoe_boots_winter') {
      // Boots
      return `<!-- Left Boot -->
              <ellipse cx="30" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-l"/>
              <rect x="25" y="86" width="10" height="7" rx="1" fill="${color}" class="char-leg-l"/>
              <!-- Right Boot -->
              <ellipse cx="50" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-r"/>
              <rect x="45" y="86" width="10" height="7" rx="1" fill="${color}" class="char-leg-r"/>`;
    } else if (id === 'shoe_heels') {
      // High Heels
      return `<!-- Left Heel -->
              <path d="M24 93 L36 93 L34 96 L24 96 Z" fill="${color}" class="char-leg-l"/>
              <line x1="24" y1="93" x2="24" y2="98" stroke="${color}" stroke-width="1.5" class="char-leg-l"/>
              <!-- Right Heel -->
              <path d="M44 93 L56 93 L54 96 L44 96 Z" fill="${color}" class="char-leg-r"/>
              <line x1="44" y1="93" x2="44" y2="98" stroke="${color}" stroke-width="1.5" class="char-leg-r"/>`;
    } else if (id === 'shoe_slippers') {
      // Bunny Slippers
      return `<!-- Left Bunny Slipper -->
              <ellipse cx="30" cy="93" rx="9" ry="6" fill="${color}" class="char-leg-l"/>
              <ellipse cx="26" cy="88" rx="2" ry="4" fill="${color}" transform="rotate(-10 26 88)" class="char-leg-l"/>
              <ellipse cx="30" cy="88" rx="2" ry="4" fill="${color}" transform="rotate(10 30 88)" class="char-leg-l"/>
              <!-- Right Bunny Slipper -->
              <ellipse cx="50" cy="93" rx="9" ry="6" fill="${color}" class="char-leg-r"/>
              <ellipse cx="46" cy="88" rx="2" ry="4" fill="${color}" transform="rotate(-10 46 88)" class="char-leg-r"/>
              <ellipse cx="50" cy="88" rx="2" ry="4" fill="${color}" transform="rotate(10 50 88)" class="char-leg-r"/>`;
    } else if (id === 'shoe_boots_ninja') {
      return `<!-- Left Ninja Boot -->
              <ellipse cx="30" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-l"/>
              <rect x="26" y="85" width="8" height="8" fill="${color}" class="char-leg-l"/>
              <line x1="26" y1="89" x2="34" y2="89" stroke="#E74C3C" stroke-width="1" class="char-leg-l"/>
              <!-- Right Ninja Boot -->
              <ellipse cx="50" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-r"/>
              <rect x="46" y="85" width="8" height="8" fill="${color}" class="char-leg-r"/>
              <line x1="46" y1="89" x2="54" y2="89" stroke="#E74C3C" stroke-width="1" class="char-leg-r"/>`;
    } else if (id === 'shoe_canvas_black' || id === 'shoe_sneaker_green') {
      return `<!-- Left Canvas -->
              <ellipse cx="30" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-l"/>
              <ellipse cx="30" cy="94" rx="7" ry="2" fill="white" class="char-leg-l"/>
              <!-- Right Canvas -->
              <ellipse cx="50" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-r"/>
              <ellipse cx="50" cy="94" rx="7" ry="2" fill="white" class="char-leg-r"/>`;
    } else if (id === 'shoe_sandals_leather' || id === 'shoe_sandals_white') {
      return `<!-- Left Sandals -->
              <ellipse cx="30" cy="93" rx="8" ry="3" fill="${color}" class="char-leg-l"/>
              <line x1="25" y1="92" x2="35" y2="92" stroke="#FFF" stroke-width="1" class="char-leg-l"/>
              <!-- Right Sandals -->
              <ellipse cx="50" cy="93" rx="8" ry="3" fill="${color}" class="char-leg-r"/>
              <line x1="45" y1="92" x2="55" y2="92" stroke="#FFF" stroke-width="1" class="char-leg-r"/>`;
    } else if (id === 'shoe_boots_rain' || id === 'shoe_boots_fur') {
      return `<!-- Left Rain Boot -->
              <ellipse cx="30" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-l"/>
              <rect x="25" y="84" width="10" height="9" rx="1" fill="${color}" class="char-leg-l"/>
              <!-- Right Rain Boot -->
              <ellipse cx="50" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-r"/>
              <rect x="45" y="84" width="10" height="9" rx="1" fill="${color}" class="char-leg-r"/>`;
    } else if (id === 'shoe_slippers_dino') {
      return `<!-- Left Dino Slipper -->
              <ellipse cx="30" cy="93" rx="9" ry="6" fill="${color}" class="char-leg-l"/>
              <!-- Claws -->
              <circle cx="25" cy="95" r="1.5" fill="#FFF" class="char-leg-l"/>
              <circle cx="30" cy="96" r="1.5" fill="#FFF" class="char-leg-l"/>
              <!-- Right Dino Slipper -->
              <ellipse cx="50" cy="93" rx="9" ry="6" fill="${color}" class="char-leg-r"/>
              <circle cx="45" cy="95" r="1.5" fill="#FFF" class="char-leg-r"/>
              <circle cx="50" cy="96" r="1.5" fill="#FFF" class="char-leg-r"/>`;
    } else if (id === 'shoe_oxford') {
      return `<!-- Left Oxford -->
              <ellipse cx="30" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-l"/>
              <rect x="26" y="90" width="8" height="3" fill="${color}" class="char-leg-l"/>
              <line x1="27" y1="93" x2="33" y2="93" stroke="rgba(255,255,255,0.3)" stroke-width="1" class="char-leg-l"/>
              <!-- Right Oxford -->
              <ellipse cx="50" cy="93" rx="8" ry="5" fill="${color}" class="char-leg-r"/>
              <rect x="46" y="90" width="8" height="3" fill="${color}" class="char-leg-r"/>
              <line x1="47" y1="93" x2="53" y2="93" stroke="rgba(255,255,255,0.3)" stroke-width="1" class="char-leg-r"/>`;
    } else if (id === 'shoe_ballet') {
      return `<!-- Left Ballet -->
              <ellipse cx="30" cy="93" rx="8" ry="4" fill="${color}" class="char-leg-l"/>
              <!-- Ribbon laces -->
              <line x1="26" y1="90" x2="34" y2="92" stroke="${color}" stroke-width="1" class="char-leg-l"/>
              <line x1="34" y1="90" x2="26" y2="92" stroke="${color}" stroke-width="1" class="char-leg-l"/>
              <!-- Right Ballet -->
              <ellipse cx="50" cy="93" rx="8" ry="4" fill="${color}" class="char-leg-r"/>
              <line x1="46" y1="90" x2="54" y2="92" stroke="${color}" stroke-width="1" class="char-leg-r"/>
              <line x1="54" y1="90" x2="46" y2="92" stroke="${color}" stroke-width="1" class="char-leg-r"/>`;
    }
    
    return defaultShoes;
  },

  renderHeadwear(outfit) {
    if (!outfit || !outfit.head) return '';
    const id = outfit.head;
    
    if (id === 'head_cap_red') {
      // Baseball cap
      return `<!-- Red Baseball Cap -->
              <path d="M22 18 Q22 4 40 4 Q58 4 58 18 Z" fill="#F44336"/>
              <!-- Cap Visor/Brim -->
              <path d="M35 15 L62 13 L60 18 L35 18 Z" fill="#D32F2F"/>`;
    } else if (id === 'head_beanie') {
      // Orange Beanie
      return `<!-- Beanie -->
              <path d="M22 20 Q22 3 40 3 Q58 3 58 20 Z" fill="#FF7043"/>
              <!-- Pom pom -->
              <circle cx="40" cy="2" r="4" fill="#E64A19"/>
              <!-- Folded band -->
              <rect x="20" y="16" width="40" height="5" rx="2" fill="#E64A19"/>`;
    } else if (id === 'head_graduation') {
      // Graduation cap
      return `<!-- Graduation cap board -->
              <polygon points="40,2 62,8 40,14 18,8" fill="#212121"/>
              <!-- Cap skull cap -->
              <rect x="30" y="8" width="20" height="8" fill="#212121"/>
              <!-- Tassel -->
              <line x1="40" y1="8" x2="22" y2="12" stroke="#FFD700" stroke-width="1.2"/>
              <circle cx="22" cy="14" r="1.5" fill="#FFD700"/>`;
    } else if (id === 'head_witch') {
      // Witch Hat
      return `<!-- Witch Hat Brim -->
              <ellipse cx="40" cy="18" rx="24" ry="5" fill="#4A148C"/>
              <!-- Witch Hat Cone -->
              <path d="M25 16 Q35 -5 32 -10 Q45 -5 55 16 Z" fill="#4A148C"/>
              <!-- Gold band -->
              <path d="M28 15 Q40 18 52 15 L50 17 Q40 20 30 17 Z" fill="#FFD700"/>`;
    } else if (id === 'head_crown_ice') {
      return `<!-- Ice Crown -->
              <polygon points="22,18 25,7 31,13 40,2 49,13 55,7 58,18" fill="#AED6F1" opacity="0.9" stroke="#EBF5FB" stroke-width="1"/>
              <circle cx="25" cy="7" r="1" fill="#FFF"/>
              <circle cx="40" cy="2" r="1" fill="#FFF"/>
              <circle cx="55" cy="7" r="1" fill="#FFF"/>`;
    } else if (id === 'head_earmuffs') {
      return `<!-- Earmuffs band -->
              <path d="M22 18 Q40 4 58 18" stroke="#555" stroke-width="2.5" fill="none"/>
              <!-- Earmuffs cushions on ears -->
              <ellipse cx="22" cy="22" rx="5" ry="7" fill="#FADBD8" stroke="#F1948A" stroke-width="1"/>
              <ellipse cx="58" cy="22" rx="5" ry="7" fill="#FADBD8" stroke="#F1948A" stroke-width="1"/>`;
    } else if (id === 'head_straw_hat') {
      return `<!-- Straw Hat Brim -->
              <ellipse cx="40" cy="19" rx="26" ry="6" fill="#F5CBA7" stroke="#D35400" stroke-width="1"/>
              <!-- Straw Hat Dome -->
              <path d="M25 18 Q27 8 40 8 Q53 8 55 18 Z" fill="#F5CBA7" stroke="#D35400" stroke-width="1"/>
              <!-- Red ribbon band -->
              <path d="M25 17 Q40 20 55 17 Q53 18 40 18 Q27 18 25 17 Z" fill="#E74C3C"/>`;
    } else if (id === 'head_chef_hat') {
      return `<!-- Chef Hat Base -->
              <rect x="28" y="12" width="24" height="7" fill="#FFFFFF" stroke="#BDC3C7" stroke-width="1"/>
              <!-- Chef Hat Puffy Top -->
              <path d="M24 13 Q16 -3 40 -3 Q64 -3 56 13 Z" fill="#FFFFFF" stroke="#BDC3C7" stroke-width="1"/>`;
    } else if (id === 'head_ribbon_band') {
      return `<!-- Headband -->
              <path d="M22 18 Q40 4 58 18" stroke="#E74C3C" stroke-width="2.5" fill="none"/>
              <!-- Red Ribbon Bow -->
              <path d="M38 4 Q30 -2 34 1 Q38 4 40 6 Q42 4 46 1 Q50 -2 42 4 Z" fill="#E74C3C"/>`;
    } else if (id === 'head_crown') {
      // Golden Crown
      return `<!-- Golden Crown -->
              <polygon points="22,18 25,6 31,12 40,1 49,12 55,6 58,18" fill="#FFD700" stroke="#DAA520" stroke-width="1.2"/>
              <circle cx="25" cy="6" r="1.5" fill="#E74C3C"/>
              <circle cx="40" cy="1" r="1.5" fill="#3498DB"/>
              <circle cx="55" cy="6" r="1.5" fill="#E74C3C"/>
              <circle cx="40" cy="11" r="2.2" fill="#E74C3C"/>`;
    } else if (id.startsWith('head_')) {
      // Generic cap fallback using item color from GAME_DATA
      const headItem = GAME_DATA.shops.clothes.items.find(i => i.id === id) ||
                       GAME_DATA.shops.accessories.items.find(i => i.id === id);
      const color = headItem?.color || '#3498DB';
      return `<!-- Fallback Cap -->
              <path d="M22 18 Q22 4 40 4 Q58 4 58 18 Z" fill="${color}"/>
              <!-- Visor/Brim -->
              <path d="M35 15 L62 13 L60 18 L35 18 Z" fill="${color}"/>
              <path d="M35 15 L62 13 L60 18 L35 18 Z" fill="rgba(0,0,0,0.15)"/>
              <!-- Button on top -->
              <circle cx="40" cy="4" r="2" fill="${color}"/>
              <circle cx="40" cy="4" r="2" fill="rgba(0,0,0,0.1)"/>`;
    }
    return '';
  },

  renderForegroundAccessories(outfit, skinColor) {
    if (!outfit) return '';
    let acc = '';
    
    // Glasses
    if (outfit.glasses === 'acc_glasses_round') {
      acc += `<!-- Round Glasses -->
              <circle cx="34" cy="24" r="6" fill="none" stroke="#2C3E50" stroke-width="1.5"/>
              <circle cx="46" cy="24" r="6" fill="none" stroke="#2C3E50" stroke-width="1.5"/>
              <line x1="40" y1="24" x2="40" y2="24" stroke="#2C3E50" stroke-width="1.5"/>
              <!-- Glass legs -->
              <line x1="28" y1="24" x2="22" y2="22" stroke="#2C3E50" stroke-width="1"/>
              <line x1="52" y1="24" x2="58" y2="22" stroke="#2C3E50" stroke-width="1"/>`;
    } else if (outfit.glasses === 'acc_glasses_sun') {
      acc += `<!-- Sunglasses -->
              <path d="M28 20 L52 20 L50 28 Q40 32 30 28 Z" fill="#1A1A1A"/>
              <line x1="40" y1="20" x2="40" y2="28" stroke="#555" stroke-width="1"/>`;
    } else if (outfit.glasses === 'acc_glasses_heart') {
      acc += `<!-- Heart Glasses -->
              <path d="M28 20 Q34 14 36 22 Q38 14 44 20 L42 27 Q36 30 30 27 Z" fill="#E74C3C" opacity="0.85"/>
              <path d="M42 20 Q48 14 50 22 Q52 14 58 20 L56 27 Q50 30 44 27 Z" fill="#E74C3C" opacity="0.85"/>`;
    } else if (outfit.glasses === 'acc_glasses_nerd') {
      acc += `<!-- Nerd Glasses -->
              <rect x="27" y="20" width="11" height="9" fill="none" stroke="#000" stroke-width="2"/>
              <rect x="42" y="20" width="11" height="9" fill="none" stroke="#000" stroke-width="2"/>
              <line x1="38" y1="23" x2="42" y2="23" stroke="#000" stroke-width="2"/>`;
    } else if (outfit.glasses === 'acc_glasses_oval') {
      acc += `<!-- Oval Glasses -->
              <ellipse cx="32" cy="24" rx="6" ry="4" fill="none" stroke="#2980B9" stroke-width="1.5"/>
              <ellipse cx="48" cy="24" rx="6" ry="4" fill="none" stroke="#2980B9" stroke-width="1.5"/>
              <line x1="38" y1="24" x2="42" y2="24" stroke="#2980B9" stroke-width="1.5"/>`;
    } else if (outfit.glasses === 'acc_glasses_star') {
      acc += `<!-- Star Glasses -->
              <polygon points="32,18 34,22 38,22 35,24 36,28 32,26 28,28 29,24 26,22 30,22" fill="none" stroke="#F1C40F" stroke-width="1.5"/>
              <polygon points="48,18 50,22 54,22 51,24 52,28 48,26 44,28 45,24 42,22 46,22" fill="none" stroke="#F1C40F" stroke-width="1.5"/>`;
    } else if (outfit.glasses && outfit.glasses.startsWith('acc_gen_')) {
      const color = this.getAccessoryColor(outfit.glasses, '#2C3E50');
      acc += `<!-- Fallback Glasses -->
              <circle cx="34" cy="24" r="6" fill="none" stroke="${color}" stroke-width="2"/>
              <circle cx="46" cy="24" r="6" fill="none" stroke="${color}" stroke-width="2"/>
              <line x1="40" y1="24" x2="40" y2="24" stroke="${color}" stroke-width="2"/>
              <line x1="28" y1="24" x2="22" y2="22" stroke="${color}" stroke-width="1"/>
              <line x1="52" y1="24" x2="58" y2="22" stroke="${color}" stroke-width="1"/>`;
    }
    
    // Scarf & Neck
    if (outfit.neck === 'acc_scarf') {
      acc += `<!-- Scarf around neck -->
              <rect x="28" y="38" width="24" height="6" rx="3" fill="#E74C3C"/>
              <!-- Hanging tail -->
              <path d="M44 42 L48 62 L40 62 Z" fill="#C0392B"/>`;
    } else if (outfit.neck === 'acc_necklace') {
      acc += `<!-- Pearl Necklace -->
              <path d="M30 42 Q40 48 50 42" stroke="white" stroke-width="2.5" fill="none" stroke-dasharray="3 1.5"/>`;
    } else if (outfit.neck === 'acc_lanyard') {
      acc += `<!-- Blue lanyard -->
              <path d="M32 40 Q40 60 48 40" stroke="#2980B9" stroke-width="1.5" fill="none"/>
              <!-- ID Card badge -->
              <rect x="36" y="55" width="8" height="10" fill="white" stroke="#DDD" stroke-width="0.5"/>
              <rect x="38" y="56" width="4" height="1.5" fill="#2980B9"/>
              <line x1="37" y1="59" x2="43" y2="59" stroke="#555" stroke-width="0.5"/>
              <line x1="37" y1="61" x2="41" y2="61" stroke="#555" stroke-width="0.5"/>`;
    } else if (outfit.neck === 'acc_scarf_stripes' || outfit.neck === 'acc_scarf_green' || outfit.neck === 'acc_scarf_yellow') {
      let scColor = outfit.neck === 'acc_scarf_stripes' ? '#27AE60' : (outfit.neck === 'acc_scarf_green' ? '#2ECC71' : '#F1C40F');
      acc += `<!-- Scarf -->
              <rect x="28" y="38" width="24" height="6" rx="3" fill="${scColor}"/>
              <path d="M44 42 L48 60 L40 60 Z" fill="${scColor}"/>`;
      if (outfit.neck === 'acc_scarf_stripes') {
        acc += `<path d="M44 46 L47 46 M43 52 L46 52" stroke="#FFF" stroke-width="2"/>`;
      }
    } else if (outfit.neck === 'acc_ribbon_red') {
      acc += `<!-- Ribbon Bow -->
              <path d="M36 38 Q40 36 44 38 L42 43 L38 43 Z" fill="#E74C3C"/>`;
    } else if (outfit.neck === 'acc_tie_formal') {
      acc += `<!-- Blue Tie -->
              <polygon points="38,40 42,40 43,58 40,62 37,58" fill="#2980B9"/>`;
    } else if (outfit.neck === 'acc_bow_tie') {
      acc += `<!-- Bow Tie -->
              <polygon points="36,40 44,40 40,43" fill="#34495E"/>`;
    } else if (outfit.neck && outfit.neck.startsWith('acc_gen_')) {
      const color = this.getAccessoryColor(outfit.neck, '#E74C3C');
      acc += `<!-- Fallback Scarf -->
              <rect x="28" y="38" width="24" height="6" rx="3" fill="${color}"/>
              <path d="M44 42 L48 54 Q48 58 45 58 Q42 58 42 54 Z" fill="${color}"/>`;
    }
    
    // Badge & Chest
    if (outfit.chest === 'acc_badge') {
      acc += `<!-- Star Badge -->
              <polygon points="46,48 48,51 51,51 49,53 50,56 48,54 46,56 47,53 45,51 48,51" fill="#FFD700"/>`;
    } else if (outfit.chest === 'acc_badge_gold' || outfit.chest === 'acc_badge_silver') {
      let bColor = outfit.chest === 'acc_badge_gold' ? '#FFD700' : '#BDC3C7';
      acc += `<!-- Gold/Silver Badge -->
              <polygon points="46,48 48,51 51,51 49,53 50,56 48,54 46,56 47,53 45,51 48,51" fill="${bColor}"/>`;
    }
    
    // Hair & Head accessories
    if (outfit.hair === 'acc_hairpin') {
      acc += `<!-- Flower hairpin -->
              <circle cx="26" cy="14" r="3" fill="#FF6B6B"/>
              <circle cx="26" cy="14" r="1" fill="#FFD700"/>`;
    } else if (outfit.hair === 'acc_hairband') {
      acc += `<!-- Cute hairband -->
              <path d="M23 15 Q40 3 57 15" stroke="#FF69B4" stroke-width="2.5" fill="none"/>
              <!-- Bow on side -->
              <path d="M22 13 Q18 8 22 10 Q26 8 22 13 Z" fill="#FF69B4"/>`;
    } else if (outfit.hair === 'acc_bow') {
      acc += `<!-- Giant Hair Bow -->
              <path d="M30 6 L50 6 L48 12 L32 12 Z" fill="#FF1493"/>
              <circle cx="40" cy="9" r="3" fill="#FF69B4"/>`;
    } else if (outfit.hair === 'acc_headphones') {
      acc += `<!-- Headphones band -->
              <path d="M22 20 Q40 4 58 20" stroke="#8E44AD" stroke-width="2.5" fill="none"/>
              <!-- Cushions on ears -->
              <ellipse cx="21" cy="24" rx="4" ry="6" fill="#9B59B6"/>
              <ellipse cx="59" cy="24" rx="4" ry="6" fill="#9B59B6"/>`;
    } else if (outfit.hair === 'acc_crown_flower') {
      acc += `<!-- Flower Crown -->
              <path d="M24 16 Q40 8 56 16" stroke="#27AE60" stroke-width="2" fill="none"/>
              <circle cx="28" cy="14" r="2.5" fill="#FF8AAE"/>
              <circle cx="36" cy="11" r="2.5" fill="#FFF"/>
              <circle cx="44" cy="11" r="2.5" fill="#FFD700"/>
              <circle cx="52" cy="14" r="2.5" fill="#FF8AAE"/>`;
    } else if (outfit.hair === 'acc_ears_cat' || outfit.hair === 'acc_ears_bunny') {
      let headShape = outfit.hair === 'acc_ears_cat' ? 
        `<polygon points="20,14 16,3 27,9" fill="#1A1A1A"/>
         <polygon points="60,14 64,3 53,9" fill="#1A1A1A"/>` :
        `<ellipse cx="23" cy="8" rx="3" ry="10" fill="#FFF" transform="rotate(-10 23 8)"/>
         <ellipse cx="57" cy="8" rx="3" ry="10" fill="#FFF" transform="rotate(10 57 8)"/>`;
      acc += `<!-- Hair ears headband -->
              <path d="M23 15 Q40 3 57 15" stroke="#333" stroke-width="2" fill="none"/>
              ${headShape}`;
    } else if (outfit.hair && outfit.hair.startsWith('acc_gen_')) {
      const color = this.getAccessoryColor(outfit.hair, '#FF69B4');
      acc += `<!-- Fallback Bow -->
              <path d="M30 6 L50 6 L48 12 L32 12 Z" fill="${color}"/>
              <circle cx="40" cy="9" r="3" fill="#FFF" opacity="0.9"/>`;
    }
    
    // Backpacks / Bags
    if (outfit.bag === 'acc_bag_school') {
      acc += `<!-- Backpack straps -->
              <rect x="27" y="44" width="4" height="16" rx="1" fill="#FF4757"/>
              <rect x="49" y="44" width="4" height="16" rx="1" fill="#FF4757"/>`;
    } else if (outfit.bag === 'acc_bag_tote') {
      acc += `<!-- Tote bag strap -->
              <path d="M48 42 L55 60 L57 60 Z" stroke="#DEB887" stroke-width="1.5" fill="none"/>
              <!-- Tote Bag body -->
              <path d="M50 56 L62 56 L64 70 L48 70 Z" fill="#F5F5DC" stroke="#DEB887" stroke-width="1"/>`;
    } else if (outfit.bag === 'acc_backpack_kitty' || outfit.bag === 'acc_backpack_frog') {
      let bagCol = outfit.bag === 'acc_backpack_kitty' ? '#FFB6C1' : '#2ECC71';
      acc += `<!-- Kitty/Frog backpack straps -->
              <rect x="27" y="44" width="4" height="16" rx="1" fill="${bagCol}"/>
              <rect x="49" y="44" width="4" height="16" rx="1" fill="${bagCol}"/>`;
    } else if (outfit.bag === 'acc_bag_crossbody') {
      acc += `<!-- Crossbody Bag strap -->
              <line x1="28" y1="42" x2="62" y2="68" stroke="#5D4037" stroke-width="1.5"/>
              <!-- Crossbody bag body -->
              <rect x="56" y="62" width="10" height="9" rx="2" fill="#CD853F" stroke="#8B5A2B" stroke-width="1"/>`;
    } else if (outfit.bag && outfit.bag.startsWith('acc_gen_')) {
      const color = this.getAccessoryColor(outfit.bag, '#FF4757');
      acc += `<!-- Fallback Bag Straps -->
              <rect x="27" y="44" width="4" height="16" rx="1" fill="${color}"/>
              <rect x="49" y="44" width="4" height="16" rx="1" fill="${color}"/>`;
    }
    
    // Wrist & Rings
    if (outfit.wrist === 'acc_bracelet') {
      acc += `<!-- Bracelet on left wrist -->
              <ellipse cx="20" cy="67" rx="6" ry="2" fill="#2ECC71" class="char-arm-l"/>`;
    } else if (outfit.wrist === 'acc_watch') {
      acc += `<!-- Watch on right wrist -->
              <ellipse cx="60" cy="67" rx="6" ry="3" fill="#34495E" class="char-arm-r"/>
              <circle cx="60" cy="67" r="1.5" fill="white" class="char-arm-r"/>`;
    }
    if (outfit.ring === 'acc_ring') {
      acc += `<!-- Ring on hand -->
              <circle cx="21" cy="68" r="1.5" fill="#FFD700" class="char-arm-l"/>`;
    }
    
    // Handheld items
    if (outfit.hand === 'acc_umbrella') {
      acc += `<!-- Umbrella handle -->
              <line x1="60" y1="67" x2="60" y2="85" stroke="#795548" stroke-width="1.5" class="char-arm-r"/>
              <path d="M58 85 Q60 88 62 85" fill="none" stroke="#795548" stroke-width="1.5" class="char-arm-r"/>
              <!-- Umbrella canopy (closed) -->
              <path d="M57 35 L63 35 L61 67 L59 67 Z" fill="#9C27B0" class="char-arm-r"/>`;
    } else if (outfit.hand === 'acc_handbag') {
      acc += `<!-- Mini handbag held in hand -->
              <path d="M57 67 Q60 60 63 67" stroke="#8B4513" stroke-width="1.5" fill="none" class="char-arm-r"/>
              <rect x="54" y="67" width="12" height="10" rx="1" fill="#D2691E" class="char-arm-r"/>`;
    } else if (outfit.hand === 'acc_balloon') {
      acc += `<!-- Red Balloon held in right hand -->
              <path d="M60 67 Q63 50 63 35" stroke="#BDC3C7" stroke-width="1" fill="none" class="char-arm-r"/>
              <circle cx="63" cy="23" r="10" fill="#E74C3C" class="char-arm-r"/>
              <polygon points="63,33 61,35 65,35" fill="#E74C3C" class="char-arm-r"/>`;
    } else if (outfit.hand === 'acc_book_magic') {
      acc += `<!-- Magic Book held in right hand -->
              <rect x="54" y="60" width="14" height="11" rx="1" fill="#8E44AD" class="char-arm-r"/>
              <rect x="56" y="62" width="10" height="7" rx="0.5" fill="#FEF9E7" class="char-arm-r"/>
              <circle cx="61" cy="65" r="1.5" fill="#FFD700" class="char-arm-r"/>`;
    } else if (outfit.hand === 'acc_umbrella_red') {
      acc += `<!-- Red umbrella handle -->
              <line x1="60" y1="67" x2="60" y2="85" stroke="#795548" stroke-width="1.5" class="char-arm-r"/>
              <path d="M58 85 Q60 88 62 85" fill="none" stroke="#795548" stroke-width="1.5" class="char-arm-r"/>
              <path d="M57 35 L63 35 L61 67 L59 67 Z" fill="#E74C3C" class="char-arm-r"/>`;
    } else if (outfit.hand === 'acc_sword_toy') {
      acc += `<!-- Toy Sword -->
              <line x1="60" y1="70" x2="60" y2="40" stroke="#BDC3C7" stroke-width="3" stroke-linecap="round" class="char-arm-r"/>
              <rect x="54" y="66" width="12" height="3" fill="#D35400" class="char-arm-r"/>
              <rect x="59" y="69" width="2" height="8" fill="#8B5A2B" class="char-arm-r"/>`;
    } else if (outfit.hand === 'acc_wand_magic') {
      acc += `<!-- Magic Wand -->
              <line x1="60" y1="72" x2="60" y2="50" stroke="#8B5A2B" stroke-width="2" class="char-arm-r"/>
              <polygon points="60,45 62,49 66,49 63,51 64,55 60,53 56,55 57,51 54,49 58,49" fill="#FFD700" class="char-arm-r"/>`;
    } else if (outfit.hand && outfit.hand.startsWith('acc_gen_')) {
      const color = this.getAccessoryColor(outfit.hand, '#9C27B0');
      acc += `<!-- Fallback Umbrella handle -->
              <line x1="60" y1="67" x2="60" y2="85" stroke="#795548" stroke-width="1.5" class="char-arm-r"/>
              <path d="M58 85 Q60 88 62 85" fill="none" stroke="#795548" stroke-width="1.5" class="char-arm-r"/>
              <!-- Fallback Umbrella canopy (closed) -->
              <path d="M57 35 L63 35 L61 67 L59 67 Z" fill="${color}" class="char-arm-r"/>`;
    }
    
    // Face & Masks
    if (outfit.face === 'acc_mask') {
      acc += `<!-- Masquerade Mask -->
              <path d="M26 22 Q40 28 54 22 L52 28 Q40 32 28 28 Z" fill="#6A0DAD"/>
              <!-- Mask eyes cutouts -->
              <ellipse cx="34" cy="24" rx="4" ry="2" fill="white"/>
              <ellipse cx="46" cy="24" rx="4" ry="2" fill="white"/>
              <circle cx="34" cy="24" r="1.8" fill="#2C1810"/>
              <circle cx="46" cy="24" r="1.8" fill="#2C1810"/>`;
    } else if (outfit.face === 'acc_mask_cat') {
      acc += `<!-- Cat Mask -->
              <path d="M26 21 L54 21 L54 31 L26 31 Z" fill="#FFF" stroke="#DDD" stroke-width="1"/>
              <!-- Pink ears inside cat mask -->
              <polygon points="26,21 21,15 31,21" fill="#FFB6C1"/>
              <polygon points="54,21 59,15 49,21" fill="#FFB6C1"/>
              <!-- whiskers -->
              <line x1="22" y1="26" x2="28" y2="27" stroke="#333" stroke-width="0.8"/>
              <line x1="58" y1="26" x2="52" y2="27" stroke="#333" stroke-width="0.8"/>
              <!-- eye dots -->
              <circle cx="34" cy="25" r="1.5" fill="#333"/>
              <circle cx="46" cy="25" r="1.5" fill="#333"/>`;
    } else if (outfit.face && outfit.face.startsWith('acc_gen_')) {
      const color = this.getAccessoryColor(outfit.face, '#E74C3C');
      acc += `<!-- Fallback Mask -->
              <path d="M28 22 Q40 28 52 22 L50 28 Q40 32 30 28 Z" fill="${color}"/>
              <circle cx="34" cy="24" r="2.5" fill="white"/>
              <circle cx="46" cy="24" r="2.5" fill="white"/>`;
    }
    
    return acc;
  }

  renderHair(gender, styleId, hairColor) {
    if (gender === 'male') {
      if (styleId === 'boy_1') { // Mái xéo (Side-swept bangs)
        return `<!-- Base Hair -->
                <path d="M 20 25 L 20 20 C 20 0, 60 0, 60 20 L 60 25 C 58 23, 54 21, 51 20 C 45 20, 38 17, 30 19 C 25 20, 22 22, 20 25 Z" fill="${hairColor}"/>
                <!-- Hair Strands / Tufts sticking out of top curve -->
                <path d="M 32 6 C 30 2, 26 4, 25 7" fill="none" stroke="${hairColor}" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M 46 6 C 49 2, 53 4, 54 7" fill="none" stroke="${hairColor}" stroke-width="2.5" stroke-linecap="round"/>
                <!-- Separation/texture lines -->
                <path d="M 33 6 Q 30 15 24 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 47 6 Q 50 15 56 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 40 6 Q 37 14 35 18" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 52 18 Q 42 17 34 19" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <!-- Lighter hair highlight shine -->
                <path d="M 28 12 Q 40 8 52 12" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round"/>`;
      } else if (styleId === 'boy_2') { // Mái bay (Curtain bangs)
        return `<!-- Base Hair -->
                <path d="M 20 25 L 20 20 C 20 0, 60 0, 60 20 L 60 25 C 58 22, 52 19, 45 18 C 41 18, 40 20, 39 20 C 38 20, 37 18, 33 18 C 26 19, 22 22, 20 25 Z" fill="${hairColor}"/>
                <!-- Hair Tuft on top -->
                <path d="M 37 7 Q 40 1 43 6" stroke="${hairColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M 33 8 Q 36 3 39 7" stroke="${hairColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
                <!-- Curtain parting lines (Mái bay) -->
                <path d="M 40 10 C 40 14, 45 18, 53 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 40 10 C 40 14, 35 18, 27 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <!-- Textured strands -->
                <path d="M 32 8 Q 28 15 23 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 48 8 Q 52 15 57 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 28 12 Q 40 7 52 12" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round"/>`;
      } else { // Mái ngố/xước (Spiky hair)
        return `<!-- Base Hair -->
                <path d="M 20 25 L 20 20 C 20 0, 60 0, 60 20 L 60 25 C 55 20, 51 18, 47 20 C 43 21, 40 17, 37 20 C 33 21, 26 19, 20 25 Z" fill="${hairColor}"/>
                <!-- Spikes on top -->
                <path d="M 25 14 L 28 3 L 33 9 L 38 2 L 43 7 L 48 3 L 52 9 L 55 4 L 56 14 Z" fill="${hairColor}"/>
                <!-- Spiky texture lines -->
                <path d="M 28 5 Q 31 13 33 18" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
                <path d="M 38 4 Q 40 12 41 17" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
                <path d="M 48 4 Q 46 13 45 18" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
                <path d="M 28 12 Q 40 8 52 12" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round"/>`;
      }
    } else {
      if (styleId === 'girl_1') { // Cozy bob hair (as in sample)
        return `<!-- Base Hair Cap -->
                <path d="M 20 25 A 20 20 0 0 1 60 25 Z" fill="${hairColor}"/>
                <!-- Side locks wrapping cheeks -->
                <path d="M 21 24 C 20 35, 23 39, 23 39 C 24 39, 25 35, 25 24 Z" fill="${hairColor}"/>
                <path d="M 59 24 C 60 35, 57 39, 57 39 C 56 39, 55 35, 55 24 Z" fill="${hairColor}"/>
                <!-- Fringe/Bangs with three curves peeking out -->
                <path d="M 21 24 Q 40 18 59 24 Q 52 28 46 23 Q 40 29 34 23 Q 28 28 21 24 Z" fill="${hairColor}"/>`;
      } else if (styleId === 'girl_2') { // Mái bay (Curtain bangs, pigtails)
        return `<!-- Main cap -->
                <path d="M 20 25 L 20 20 C 20 0, 60 0, 60 20 L 60 25 C 56 20, 48 18, 44 20 C 40 21, 38 17, 33 18 C 28 20, 24 21, 20 25 Z" fill="${hairColor}"/>
                <!-- Fluffy Left tail -->
                <path d="M 20 25 C 10 24, 6 42, 14 48 C 16 49, 17 44, 20 33 Z" fill="${hairColor}"/>
                <circle cx="19" cy="27" r="3" fill="#FF6B6B"/>
                <!-- Fluffy Right tail -->
                <path d="M 60 25 C 70 24, 74 42, 66 48 C 64 49, 63 44, 60 33 Z" fill="${hairColor}"/>
                <circle cx="61" cy="27" r="3" fill="#FF6B6B"/>
                <!-- Parted curtain bangs overlay lines -->
                <path d="M 40 10 C 40 14, 45 18, 53 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 40 10 C 40 14, 35 18, 27 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <!-- Texture strands -->
                <path d="M 31 8 Q 26 15 22 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 49 8 Q 54 15 58 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 28 12 Q 40 7 52 12" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round"/>`;
      } else { // Mái xéo (Side-swept bangs, ponytail)
        return `<!-- Main cap & swept bangs -->
                <path d="M 20 25 L 20 20 C 20 0, 60 0, 60 20 L 60 25 C 58 23, 54 21, 51 20 C 45 20, 38 17, 30 19 C 25 20, 22 22, 20 25 Z" fill="${hairColor}"/>
                <!-- Ponytail tail -->
                <path d="M 56 16 C 68 10, 72 32, 62 44 C 60 45, 59 40, 56 22 Z" fill="${hairColor}"/>
                <ellipse cx="56" cy="18" rx="2" ry="4" fill="#4ECDC4" transform="rotate(30 56 18)"/>
                <!-- Swept locks overlay -->
                <path d="M 52 18 Q 42 17 34 19" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 33 6 Q 30 15 24 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 47 6 Q 50 15 56 20" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M 28 12 Q 40 8 52 12" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round"/>`;
      }
    }
  },

  renderAccessories(outfit) {
    return ''; // Overridden by detailed foreground/background accessories
  },

  getOutfitColors(outfit) {
    const defaults = { topColor: '#6C63FF', bottomColor: '#1565C0', shoesColor: '#3E2723' };
    if (!outfit) return defaults;
    
    // Find colors from items data
    const allItems = [
      ...GAME_DATA.shops.clothes.items,
      ...GAME_DATA.shops.accessories.items
    ];
    
    const topItem = allItems.find(i => i.id === outfit.top);
    const bottomItem = allItems.find(i => i.id === outfit.bottom);
    const shoeItem = allItems.find(i => i.id === outfit.shoes);
    
    return {
      topColor: topItem?.color || defaults.topColor,
      bottomColor: bottomItem?.color || defaults.bottomColor,
      shoesColor: shoeItem?.color || defaults.shoesColor,
    };
  },

  // ---- PET RENDERING ----
  renderPet(pet, size = 60, animate = true) {
    if (!pet) return '';
    const isHungry = pet.stats?.hunger < 30;
    const isSad = pet.stats?.happiness < 30;
    const animClass = animate ? (isHungry || isSad ? 'pet-sad' : 'pet-idle') : '';
    
    if (pet.type === 'dog') {
      return this.renderDog(pet, size, animClass);
    } else {
      return this.renderCat(pet, size, animClass);
    }
  },

  renderDog(pet, size, animClass) {
    const colors = this.getPetColors(pet);
    const id = pet.id;
    
    // Get stats
    const stats = pet.stats || { hunger: 100, happiness: 100, cleanliness: 100, energy: 100 };
    const hunger = stats.hunger !== undefined ? stats.hunger : 100;
    const happiness = stats.happiness !== undefined ? stats.happiness : 100;
    const cleanliness = stats.cleanliness !== undefined ? stats.cleanliness : 100;
    const energy = stats.energy !== undefined ? stats.energy : 100;

    const isSleeping = energy < 15;
    const isSleepy = energy >= 15 && energy < 35;
    const isHungry = hunger < 35;
    const isSad = happiness < 35;
    const isHappy = happiness >= 65;
    const isDirty = cleanliness < 35;

    // Breed-specific detailed markings
    let bodyMarkings = '';
    let headMarkings = '';
    let earMarkings = '';
    
    if (id === 'dog_corgi') {
      bodyMarkings = `<ellipse cx="40" cy="62" rx="12" ry="10" fill="#FFF"/>`;
      headMarkings = `<rect x="38" y="16" width="4" height="10" fill="#FFF"/>
                      <ellipse cx="28" cy="34" rx="5" ry="3" fill="#FFF"/>
                      <ellipse cx="52" cy="34" rx="5" ry="3" fill="#FFF"/>`;
    } else if (id === 'dog_shiba') {
      bodyMarkings = `<ellipse cx="40" cy="62" rx="13" ry="9" fill="#FFF"/>`;
      headMarkings = `<ellipse cx="27" cy="33" rx="5" ry="3.5" fill="#FFF"/>
                      <ellipse cx="53" cy="33" rx="5" ry="3.5" fill="#FFF"/>`;
    } else if (id === 'dog_husky') {
      bodyMarkings = `<path d="M26 55 Q40 45 40 68 Q40 45 54 55 Q40 73 26 55 Z" fill="#FFF"/>`;
      headMarkings = `<path d="M26 30 Q30 18 40 27 Q50 18 54 30 Q48 38 40 36 Q32 38 26 30 Z" fill="#FFF"/>`;
    } else if (id === 'dog_poodle') {
      // Fluffy wool details
      bodyMarkings = `<circle cx="30" cy="50" r="5" fill="#FFF" opacity="0.6"/>
                      <circle cx="50" cy="50" r="5" fill="#FFF" opacity="0.6"/>
                      <circle cx="40" cy="60" r="6" fill="#FFF" opacity="0.6"/>`;
      headMarkings = `<circle cx="40" cy="14" r="5" fill="#FFF" opacity="0.8"/>
                      <circle cx="33" cy="16" r="4" fill="#FFF" opacity="0.8"/>
                      <circle cx="47" cy="16" r="4" fill="#FFF" opacity="0.8"/>`;
      earMarkings = `<circle cx="22" cy="24" r="5.5" fill="#FFF" opacity="0.8"/>
                     <circle cx="58" cy="24" r="5.5" fill="#FFF" opacity="0.8"/>`;
    } else if (id === 'dog_labrador') {
      // Rosy cheeks
      headMarkings = `<circle cx="28" cy="33" r="3.5" fill="#FF8A8A" opacity="0.6"/>
                      <circle cx="52" cy="33" r="3.5" fill="#FF8A8A" opacity="0.6"/>`;
    }

    // Dynamic eyes
    let eyesHtml = '';
    if (isSleeping) {
      eyesHtml = `
        <path d="M29 27 Q33 30 37 27" stroke="#3D2B1F" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M43 27 Q47 30 51 27" stroke="#3D2B1F" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      `;
    } else if (isHungry || isSad) {
      eyesHtml = `
        <path d="M29 23 L35 26" stroke="#3D2B1F" stroke-width="2" stroke-linecap="round"/>
        <path d="M51 23 L45 26" stroke="#3D2B1F" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="33" cy="27" rx="1.8" ry="3.5" fill="#3D2B1F"/>
        <ellipse cx="47" cy="27" rx="1.8" ry="3.5" fill="#3D2B1F"/>
      `;
    } else {
      // Normal/happy flat eyes (Cozy Style)
      eyesHtml = `
        <ellipse cx="33" cy="26" rx="2" ry="3.8" fill="#3D2B1F"/>
        <ellipse cx="47" cy="26" rx="2" ry="3.8" fill="#3D2B1F"/>
      `;
    }

    // Dynamic mouth
    let mouthHtml = '';
    if (isSleeping) {
      mouthHtml = `<path d="M37 38 Q40 40 43 38" stroke="#2C1810" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    } else if (isHungry || isSad) {
      mouthHtml = `<path d="M35 41 Q40 36 45 41" stroke="#2C1810" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    } else if (isHappy) {
      mouthHtml = `<path d="M35 37 Q40 45 45 37 Z" fill="#E74C3C" stroke="#2C1810" stroke-width="1.5"/>`;
    } else {
      mouthHtml = `<path d="M34 37 Q40 42 46 37" stroke="#2C1810" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    }

    // Dirt spots
    let dirtyMarkings = '';
    if (isDirty) {
      dirtyMarkings = `
        <!-- Mud spots -->
        <circle cx="28" cy="58" r="3.5" fill="#5C4033" opacity="0.75"/>
        <circle cx="46" cy="63" r="2.5" fill="#5C4033" opacity="0.75"/>
        <circle cx="50" cy="48" r="4" fill="#5C4033" opacity="0.65"/>
        <!-- Buzzing flies -->
        <g opacity="0.8">
          <circle cx="20" cy="45" r="1" fill="#333"/>
          <path d="M19 44 L21 46" stroke="#333" stroke-width="0.5"/>
          <circle cx="58" cy="42" r="1" fill="#333"/>
          <path d="M57 41 L59 43" stroke="#333" stroke-width="0.5"/>
        </g>
      `;
    }

    // Status bubble
    let statusBubble = '';
    if (isSleeping) {
      statusBubble = `
        <!-- Sleeping Zzz -->
        <g>
          <ellipse cx="64" cy="18" rx="11" ry="9" fill="rgba(41,128,185,0.75)" stroke="#AED6F1" stroke-width="1"/>
          <ellipse cx="57" cy="26" rx="3.5" ry="3.5" fill="rgba(41,128,185,0.75)"/>
          <ellipse cx="53" cy="31" rx="2" ry="2" fill="rgba(41,128,185,0.75)"/>
          <text x="64" y="21" font-size="9" fill="#FFF" text-anchor="middle" font-weight="bold" font-family="monospace">Zzz</text>
        </g>
      `;
    } else if (isSleepy) {
      statusBubble = `
        <!-- Sleepy yawn -->
        <g>
          <ellipse cx="64" cy="18" rx="10" ry="8" fill="rgba(241,196,15,0.75)" stroke="#FFF" stroke-width="1"/>
          <ellipse cx="57" cy="26" rx="3" ry="3" fill="rgba(241,196,15,0.75)"/>
          <text x="64" y="21" font-size="9" fill="#FFF" text-anchor="middle" font-weight="bold">🥱</text>
        </g>
      `;
    }

    if (isHungry) {
      statusBubble += `
        <!-- Hungry warning -->
        <g>
          <ellipse cx="15" cy="18" rx="10" ry="9" fill="rgba(0,0,0,0.75)" stroke="#FF6B6B" stroke-width="1.5"/>
          <ellipse cx="22" cy="25" rx="3" ry="3" fill="rgba(0,0,0,0.75)"/>
          <ellipse cx="25" cy="30" rx="1.5" ry="1.5" fill="rgba(0,0,0,0.75)"/>
          <text x="15" y="21" font-size="9" fill="#FFF" text-anchor="middle" font-weight="bold">🍖</text>
        </g>
      `;
    }

    return `
    <div class="pet-sprite ${animClass}" style="display:inline-block;position:relative;">
      <svg viewBox="0 0 80 80" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- Body -->
        <ellipse cx="40" cy="55" rx="22" ry="18" fill="${colors.body}"/>
        ${bodyMarkings}
        ${dirtyMarkings}
        
        <!-- Head -->
        <circle cx="40" cy="30" r="18" fill="${colors.body}"/>
        ${headMarkings}
        
        <!-- Cute Cheek Blush -->
        <circle cx="27" cy="32" r="3" fill="rgba(253,142,142,0.45)"/>
        <circle cx="53" cy="32" r="3" fill="rgba(253,142,142,0.45)"/>
        
        <!-- Ears -->
        <ellipse cx="24" cy="20" rx="8" ry="12" fill="${colors.ear}" transform="rotate(-15 24 20)"/>
        ${earMarkings}
        <ellipse cx="56" cy="20" rx="8" ry="12" fill="${colors.ear}" transform="rotate(15 56 20)"/>
        ${earMarkings}
        
        <!-- Snout -->
        <ellipse cx="40" cy="36" rx="10" ry="7" fill="${colors.snout}"/>
        <!-- Nose -->
        <ellipse cx="40" cy="31" rx="4" ry="3" fill="#2C1810"/>
        <!-- Nostrils -->
        <circle cx="38" cy="31" r="1" fill="rgba(0,0,0,0.5)"/>
        <circle cx="42" cy="31" r="1" fill="rgba(0,0,0,0.5)"/>
        
        <!-- Eyes -->
        ${eyesHtml}
        
        <!-- Mouth -->
        ${mouthHtml}
        
        <!-- Tail -->
        <path d="M62 50 Q78 40 75 28 Q73 22 68 28" stroke="${colors.body}" stroke-width="6" fill="none" stroke-linecap="round" class="pet-tail"/>
        
        <!-- Legs -->
        <rect x="22" y="68" width="10" height="14" rx="5" fill="${colors.body}"/>
        <rect x="35" y="68" width="10" height="14" rx="5" fill="${colors.body}"/>
        <rect x="48" y="68" width="10" height="14" rx="5" fill="${colors.body}"/>
        
        <!-- Paws -->
        <ellipse cx="27" cy="80" rx="6" ry="4" fill="${colors.snout}"/>
        <ellipse cx="40" cy="80" rx="6" ry="4" fill="${colors.snout}"/>
        <ellipse cx="53" cy="80" rx="6" ry="4" fill="${colors.snout}"/>
        
        <!-- Status Bubbles -->
        ${statusBubble}
      </svg>
    </div>`;
  },

  renderCat(pet, size, animClass) {
    const colors = this.getPetColors(pet);
    const id = pet.id;
    
    // Get stats
    const stats = pet.stats || { hunger: 100, happiness: 100, cleanliness: 100, energy: 100 };
    const hunger = stats.hunger !== undefined ? stats.hunger : 100;
    const happiness = stats.happiness !== undefined ? stats.happiness : 100;
    const cleanliness = stats.cleanliness !== undefined ? stats.cleanliness : 100;
    const energy = stats.energy !== undefined ? stats.energy : 100;

    const isSleeping = energy < 15;
    const isSleepy = energy >= 15 && energy < 35;
    const isHungry = hunger < 35;
    const isSad = happiness < 35;
    const isHappy = happiness >= 65;
    const isDirty = cleanliness < 35;

    let bodyMarkings = '';
    let headMarkings = '';
    
    // Cozy flat eyes and cheeks (matches user's cozy illustration style)
    let eyesHtml = '';
    if (isSleeping) {
      eyesHtml = `
        <path d="M29 27 Q33 30 37 27" stroke="#3D2B1F" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M43 27 Q47 30 51 27" stroke="#3D2B1F" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      `;
    } else {
      eyesHtml = `
        <ellipse cx="32" cy="27" rx="1.8" ry="3.5" fill="#3D2B1F"/>
        <ellipse cx="48" cy="27" rx="1.8" ry="3.5" fill="#3D2B1F"/>
      `;
    }

    let mouthHtml = `<path d="M37 34.5 Q40 37.5 43 34.5" stroke="#3D2B1F" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    if (isHungry || isSad) {
      mouthHtml = `<path d="M37 37 Q40 34 43 37" stroke="#3D2B1F" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    }

    // Default white chest/belly for the cozy look
    let chestPatch = `<path d="M 30 72 C 30 50, 50 50, 50 72 Z" fill="#FFF" opacity="0.95"/>`;

    if (id === 'cat_orange') {
      bodyMarkings = ``;
      headMarkings = ``;
    } else if (id === 'cat_siamese') {
      headMarkings = `<ellipse cx="40" cy="30" rx="10" ry="7" fill="#5D4037"/>`;
      chestPatch = `<path d="M 30 72 C 30 52, 50 52, 50 72 Z" fill="#5D4037" opacity="0.2"/>`;
    } else if (id === 'cat_black') {
      eyesHtml = isSleeping ? eyesHtml : `
        <ellipse cx="32" cy="27" rx="2" ry="4" fill="#FFEB3B"/>
        <ellipse cx="48" cy="27" rx="2" ry="4" fill="#FFEB3B"/>
        <ellipse cx="32" cy="27" rx="0.8" ry="3.2" fill="#1A1A1A"/>
        <ellipse cx="48" cy="27" rx="0.8" ry="3.2" fill="#1A1A1A"/>
      `;
      chestPatch = `<circle cx="40" cy="62" r="6" fill="#FFF"/>`;
    } else if (id === 'cat_british') {
      chestPatch = `<path d="M 31 72 C 31 52, 49 52, 49 72 Z" fill="#FFF" opacity="0.5"/>`;
    } else if (id === 'cat_maine') {
      chestPatch = `<path d="M 24 55 Q 40 45 56 55 Q 40 73 24 55 Z" fill="#E8D7D0"/>`;
    }

    // Dirty mud spots
    let dirtyMarkings = '';
    if (isDirty) {
      dirtyMarkings = `
        <circle cx="28" cy="62" r="3" fill="#5C4033" opacity="0.6"/>
        <circle cx="48" cy="65" r="2" fill="#5C4033" opacity="0.6"/>
      `;
    }

    // Status bubble
    let statusBubble = '';
    if (isSleeping) {
      statusBubble = `
        <g>
          <ellipse cx="64" cy="18" rx="11" ry="9" fill="rgba(41,128,185,0.75)" stroke="#AED6F1" stroke-width="1"/>
          <ellipse cx="57" cy="26" rx="3.5" ry="3.5" fill="rgba(41,128,185,0.75)"/>
          <ellipse cx="53" cy="31" rx="2" ry="2" fill="rgba(41,128,185,0.75)"/>
          <text x="64" y="21" font-size="9" fill="#FFF" text-anchor="middle" font-weight="bold" font-family="monospace">Zzz</text>
        </g>
      `;
    } else if (isSleepy) {
      statusBubble = `
        <g>
          <ellipse cx="64" cy="18" rx="10" ry="8" fill="rgba(241,196,15,0.75)" stroke="#FFF" stroke-width="1"/>
          <ellipse cx="57" cy="26" rx="3" ry="3" fill="rgba(241,196,15,0.75)"/>
          <text x="64" y="21" font-size="9" fill="#FFF" text-anchor="middle" font-weight="bold">🥱</text>
        </g>
      `;
    }

    if (isHungry) {
      statusBubble += `
        <g>
          <ellipse cx="15" cy="18" rx="10" ry="9" fill="rgba(0,0,0,0.75)" stroke="#FF6B6B" stroke-width="1.5"/>
          <ellipse cx="22" cy="25" rx="3" ry="3" fill="rgba(0,0,0,0.75)"/>
          <ellipse cx="25" cy="30" rx="1.5" ry="1.5" fill="rgba(0,0,0,0.75)"/>
          <text x="15" y="21" font-size="9" fill="#FFF" text-anchor="middle" font-weight="bold">🍖</text>
        </g>
      `;
    }

    return `
    <div class="pet-sprite ${animClass}" style="display:inline-block;position:relative;">
      <svg viewBox="0 0 80 80" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <ellipse cx="40" cy="76" rx="20" ry="3" fill="rgba(0,0,0,0.15)"/>

        <!-- Tail -->
        <g class="pet-tail">
          <path d="M 54 64 Q 68 58 65 42 Q 62 30 65 40" stroke="${colors.body}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
          <path d="M 64 42 L 65 40" stroke="#FFF" stroke-width="5.5" stroke-linecap="round"/>
        </g>

        <!-- Sitting Thighs (Left and Right) -->
        <circle cx="26" cy="65" r="8" fill="${colors.body}"/>
        <circle cx="54" cy="65" r="8" fill="${colors.body}"/>

        <!-- Pear-shaped Sitting Body -->
        <path d="M 24 68 C 24 45, 56 45, 56 68 Z" fill="${colors.body}"/>
        ${chestPatch}
        ${bodyMarkings}
        ${dirtyMarkings}

        <!-- Front feet (Paws) -->
        <rect x="31" y="60" width="6" height="15" rx="3" fill="${colors.body}"/>
        <rect x="43" y="60" width="6" height="15" rx="3" fill="${colors.body}"/>
        <circle cx="34" cy="74.5" r="3.2" fill="#FFF"/>
        <circle cx="46" cy="74.5" r="3.2" fill="#FFF"/>

        <!-- Triangular Ears -->
        <!-- Left Ear -->
        <polygon points="21,12 28,26 15,24" fill="${colors.body}"/>
        <polygon points="22,15 27,24 17,23" fill="#FFAEC9"/>
        <!-- Right Ear -->
        <polygon points="59,12 52,26 65,24" fill="${colors.body}"/>
        <polygon points="58,15 53,24 63,23" fill="#FFAEC9"/>

        <!-- Head -->
        <circle cx="40" cy="30" r="16.5" fill="${colors.body}"/>
        ${headMarkings}

        <!-- Cute Cheek Blush -->
        <circle cx="27" cy="32" r="3.2" fill="rgba(253,142,142,0.45)"/>
        <circle cx="53" cy="32" r="3.2" fill="rgba(253,142,142,0.45)"/>

        <!-- Snout (White round patch) -->
        <ellipse cx="40" cy="33.5" rx="4.5" ry="3.5" fill="#FFF"/>
        
        <!-- Nose (Small dark triangle) -->
        <polygon points="38.5,32.5 41.5,32.5 40,34" fill="#3D2B1F"/>

        <!-- Eyes -->
        ${eyesHtml}

        <!-- Mouth -->
        ${mouthHtml}

        <!-- Status Bubbles -->
        ${statusBubble}
      </svg>
    </div>`;
  },

  getPetColors(pet) {
    const colorMap = {
      '#C8A97A': { body: '#C8A97A', ear: '#A07850', snout: '#E8C8A0', eyes: '#4A3020' }, // Labrador
      '#E8A85A': { body: '#E8A85A', ear: '#C88030', snout: '#F8C880', eyes: '#3A2010' }, // Corgi
      '#F0E0E0': { body: '#F0E0E0', ear: '#D0B0B0', snout: '#FFF0F0', eyes: '#2C1810' }, // Poodle
      '#D4784A': { body: '#D4784A', ear: '#A04820', snout: '#E89870', eyes: '#2C1810' }, // Shiba
      '#708090': { body: '#708090', ear: '#506070', snout: '#A0B0C0', eyes: '#2980B9' }, // Husky
      '#FF8C42': { body: '#FF8C42', ear: '#CC5500', snout: '#FFB380', eyes: '#27AE60' }, // Orange cat
      '#E05A47': { body: '#E05A47', ear: '#B83A28', snout: '#FEE5D9', eyes: '#3D2B1F' }, // Orange cat (cozy terracotta)
      '#2C2C2C': { body: '#3C3C3C', ear: '#1A1A1A', snout: '#555', eyes: '#FFD700' }, // Black cat
      '#9B8EA1': { body: '#9B8EA1', ear: '#7B6E81', snout: '#BBB0C1', eyes: '#F39C12' }, // British
      '#A0522D': { body: '#A0522D', ear: '#80320D', snout: '#C0724D', eyes: '#27AE60' }, // Maine Coon
      '#F5DEB3': { body: '#F5DEB3', ear: '#C8A87A', snout: '#FFF0D5', eyes: '#2980B9' }, // Siamese
    };
    const c = pet.color;
    return colorMap[c] || { body: c, ear: '#888', snout: '#DDD', eyes: '#333' };
  },

  // ---- HOUSE RENDERING ----
  renderHouseFront(student, size = 100) {
    const houseColors = HOUSE_COLORS;
    const colorIdx = student.houseColor || (student.id ? parseInt(student.id.slice(-1)) : 0);
    const mainColor = houseColors[colorIdx % houseColors.length];
    const roofColor = this.darken(mainColor, 30);
    
    return `
    <div class="house-exterior" style="position:relative;display:inline-block;">
      <svg viewBox="0 0 120 130" width="${size}" height="${size * 1.08}" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <ellipse cx="60" cy="128" rx="40" ry="5" fill="rgba(0,0,0,0.2)"/>
        <!-- Roof -->
        <polygon points="10,60 60,10 110,60" fill="${roofColor}"/>
        <polygon points="15,60 60,15 105,60" fill="${mainColor}" opacity="0.3"/>
        <!-- Chimney -->
        <rect x="80" y="25" width="12" height="25" fill="${this.darken(mainColor, 20)}"/>
        <rect x="77" y="22" width="18" height="5" rx="2" fill="${this.darken(mainColor, 10)}"/>
        <!-- Walls -->
        <rect x="15" y="60" width="90" height="65" fill="${mainColor}"/>
        <!-- Door -->
        <rect x="46" y="95" width="28" height="30" rx="3" fill="${this.darken(mainColor, 25)}"/>
        <circle cx="70" cy="110" r="2.5" fill="#FFD700"/>
        <!-- Windows -->
        <rect x="22" y="70" width="24" height="20" rx="3" fill="#ADE8F4"/>
        <line x1="34" y1="70" x2="34" y2="90" stroke="white" stroke-width="1.5"/>
        <line x1="22" y1="80" x2="46" y2="80" stroke="white" stroke-width="1.5"/>
        <rect x="74" y="70" width="24" height="20" rx="3" fill="#ADE8F4"/>
        <line x1="86" y1="70" x2="86" y2="90" stroke="white" stroke-width="1.5"/>
        <line x1="74" y1="80" x2="98" y2="80" stroke="white" stroke-width="1.5"/>
        <!-- Flower box -->
        <rect x="20" y="88" width="26" height="6" rx="2" fill="#8B4513"/>
        <circle cx="24" cy="86" r="3" fill="#FF6B6B"/>
        <circle cx="30" cy="85" r="3" fill="#FFD700"/>
        <circle cx="36" cy="86" r="3" fill="#FF6B6B"/>
        <circle cx="42" cy="85" r="3" fill="#98FB98"/>
        <!-- Step -->
        <rect x="40" y="123" width="40" height="5" rx="2" fill="${this.darken(mainColor, 15)}"/>
      </svg>
    </div>`;
  },

  darken(hex, amount) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return '#' + [r, g, b].map(v => Math.max(0, v - amount).toString(16).padStart(2, '0')).join('');
  },

  // ---- PET STATS BAR ----
  renderPetStats(pet) {
    if (!pet || !pet.stats) return '';
    const stats = pet.stats;
    const bars = [
      { key: 'hunger', label: 'No bụng', labelEn: 'Hunger', icon: '🍖' },
      { key: 'happiness', label: 'Hạnh phúc', labelEn: 'Happy', icon: '😊' },
      { key: 'cleanliness', label: 'Vệ sinh', labelEn: 'Clean', icon: '🛁' },
      { key: 'energy', label: 'Năng lượng', labelEn: 'Energy', icon: '⚡' },
    ];
    return bars.map(bar => {
      const val = Math.round(stats[bar.key] || 0);
      const color = this.getStatColor(val);
      return `
      <div class="stat-bar-wrapper">
        <span class="stat-icon">${bar.icon}</span>
        <div class="stat-label">${bar.label}</div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" style="width:${val}%;background:${color};transition:all 0.5s ease;">
          </div>
        </div>
        <span class="stat-value" style="color:${color}">${val}%</span>
      </div>`;
    }).join('');
  },

  getStatColor(val) {
    const hue = Math.max(0, Math.min(120, val * 1.2));
    return `hsl(${hue}, 85%, 50%)`;
  },

  ITEM_DIMENSIONS: {
    // Furniture
    fur_bed_single: { w: 90, h: 60 },
    fur_bed_double: { w: 120, h: 80 },
    fur_pet_bed: { w: 60, h: 45 },
    fur_desk_study: { w: 85, h: 70 },
    fur_chair_spin: { w: 50, h: 70 },
    fur_wardrobe: { w: 75, h: 110 },
    fur_tv: { w: 100, h: 75 },
    fur_fridge: { w: 65, h: 110 },
    fur_sofa: { w: 120, h: 65 },
    fur_coffee_table: { w: 70, h: 45 },
    fur_rug: { w: 110, h: 45 },
    fur_nightstand: { w: 45, h: 50 },
    fur_bookshelf: { w: 80, h: 110 },
    fur_lamp_stand: { w: 40, h: 100 },
    fur_vanity: { w: 75, h: 95 },
    fur_armchair: { w: 65, h: 65 },
    fur_computer: { w: 60, h: 55 },
    fur_plant_pot: { w: 50, h: 80 },
    fur_mirror: { w: 45, h: 110 },
    fur_microwave: { w: 55, h: 40 },
    fur_washer: { w: 65, h: 75 },
    fur_bunk_bed: { w: 90, h: 110 },
    fur_gaming_chair: { w: 55, h: 75 },
    fur_dining_table: { w: 100, h: 60 },
    fur_dining_chair: { w: 45, h: 65 },
    fur_kitchen_cabinet: { w: 90, h: 80 },
    fur_piano: { w: 95, h: 85 },
    fur_beanbag: { w: 65, h: 50 },
    fur_aquarium: { w: 75, h: 65 },
    fur_fireplace: { w: 85, h: 80 },
    fur_tv_cabinet: { w: 90, h: 50 },
    fur_bookshelf_modern: { w: 80, h: 100 },
    fur_desk_gaming: { w: 85, h: 70 },
    fur_chest_drawers: { w: 70, h: 75 },
    fur_coffee_table_glass: { w: 70, h: 40 },
    fur_shoe_cabinet: { w: 65, h: 70 },
    fur_kitchen_shelf: { w: 60, h: 45 },
    fur_dining_table_small: { w: 75, h: 60 },
    fur_stool: { w: 35, h: 45 },
    fur_water_dispenser: { w: 40, h: 85 },
    fur_bathtub: { w: 100, h: 60 },
    fur_sink: { w: 55, h: 75 },
    fur_toilet: { w: 45, h: 70 },
    fur_laundry_basket: { w: 45, h: 55 },
    fur_towel_rack: { w: 50, h: 70 },
    fur_pet_house: { w: 70, h: 65 },
    fur_pet_feeder: { w: 45, h: 35 },
    fur_sofa_long: { w: 140, h: 65 },
    fur_desk_lamp: { w: 30, h: 45 },
    fur_coat_hanger: { w: 40, h: 95 },

    // Decor
    dec_painting: { w: 60, h: 45 },
    dec_plant_small: { w: 30, h: 40 },
    dec_led_lights: { w: 120, h: 30 },
    dec_photo_frame: { w: 35, h: 40 },
    dec_doormat: { w: 70, h: 30 },
    dec_curtain: { w: 100, h: 90 },
    dec_cushion: { w: 35, h: 35 },
    dec_clock: { w: 40, h: 40 },
    dec_xmas_tree: { w: 70, h: 100 },
    dec_flower_vase: { w: 35, h: 50 },
    dec_candle: { w: 25, h: 35 },
    dec_wall_hook: { w: 50, h: 25 },
    dec_windchime: { w: 30, h: 65 },
    dec_music_box: { w: 35, h: 35 },
    dec_poster: { w: 45, h: 60 },
    dec_rug_welcome: { w: 65, h: 25 },
    dec_mirror_wall: { w: 45, h: 55 },
    dec_plant_hanging: { w: 35, h: 60 },
    dec_calendar: { w: 30, h: 40 },
    dec_tissue_box: { w: 30, h: 25 },
    dec_rug_star: { w: 60, h: 45 },
    dec_painting_sunset: { w: 70, h: 50 },
    dec_cushion_cat: { w: 35, h: 35 },
    dec_plant_monstera: { w: 50, h: 70 },
    dec_books_pile: { w: 40, h: 30 },
    dec_cup_hot_chocolate: { w: 25, h: 25 },
    dec_tissue_roll: { w: 20, h: 25 },
    dec_wall_clock_modern: { w: 40, h: 40 },
    dec_rug_heart: { w: 60, h: 45 },
    dec_painting_cat: { w: 50, h: 45 },
    dec_slipper_rack: { w: 55, h: 35 },
    dec_snowglobe: { w: 30, h: 35 },
    dec_alarm_clock: { w: 30, h: 30 },
    dec_plant_cactus_tall: { w: 35, h: 65 },
    dec_board_game: { w: 45, h: 25 },
    dec_lava_lamp: { w: 25, h: 60 },
    dec_calendar_cat: { w: 30, h: 30 },
    dec_plate_fruits: { w: 40, h: 25 },
    dec_diffuser: { w: 30, h: 40 },
    dec_wall_stickers: { w: 80, h: 60 }
  },

  renderFurnitureSVG(itemId, width = "100%", height = "100%") {
    let dims = this.ITEM_DIMENSIONS[itemId];
    if (!dims) {
      const item = GAME_DATA.shops.furniture.items.find(i => i.id === itemId) ||
                   GAME_DATA.shops.decor.items.find(i => i.id === itemId);
      if (item && item.w && item.h) {
        dims = { w: item.w, h: item.h };
      } else {
        dims = { w: 100, h: 100 };
      }
    }

    // Fallbacks for generated furniture and decor
    if (itemId.startsWith('fur_gen_') || itemId.startsWith('dec_gen_')) {
      let gc = '';
      if (itemId.startsWith('fur_gen_')) {
        const idx = parseInt(itemId.replace('fur_gen_', ''));
        const typeIndex = (idx - 1) % 6;
        const item = GAME_DATA.shops.furniture.items.find(i => i.id === itemId);
        const color = item?.color || '#D35400';
        
        if (typeIndex === 0) { // Sofa: w=80, h=60
          gc = `<!-- Generated Sofa -->
               <rect x="5" y="40" width="70" height="15" rx="2" fill="${color}" opacity="0.9" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
               <rect x="5" y="15" width="70" height="28" rx="5" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
               <rect x="0" y="30" width="10" height="25" rx="3" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
               <rect x="70" y="30" width="10" height="25" rx="3" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>`;
        } else if (typeIndex === 1) { // Table: w=70, h=45
          gc = `<!-- Generated Table -->
               <rect x="10" y="20" width="6" height="22" fill="#5C3A21"/>
               <rect x="54" y="20" width="6" height="22" fill="#5C3A21"/>
               <rect x="5" y="12" width="60" height="8" rx="2" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>`;
        } else if (typeIndex === 2) { // Cabinet: w=75, h=90
          gc = `<!-- Generated Cabinet -->
               <rect x="5" y="5" width="65" height="80" rx="4" fill="${color}" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
               <rect x="10" y="10" width="25" height="70" fill="rgba(255,255,255,0.1)" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
               <rect x="40" y="10" width="25" height="70" fill="rgba(255,255,255,0.1)" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
               <circle cx="31" cy="45" r="2" fill="#FFD700"/>
               <circle cx="44" cy="45" r="2" fill="#FFD700"/>`;
        } else if (typeIndex === 3) { // Chair: w=50, h=65
          gc = `<!-- Generated Chair -->
               <rect x="10" y="38" width="30" height="10" rx="2" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
               <rect x="10" y="15" width="30" height="25" rx="4" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
               <rect x="12" y="48" width="4" height="15" fill="#5C3A21"/>
               <rect x="34" y="48" width="4" height="15" fill="#5C3A21"/>`;
        } else if (typeIndex === 4) { // Shelf: w=80, h=100
          gc = `<!-- Generated Shelf -->
               <rect x="5" y="5" width="70" height="90" rx="3" fill="${color}" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
               <line x1="5" y1="35" x2="75" y2="35" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
               <line x1="5" y1="65" x2="75" y2="65" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>`;
        } else if (typeIndex === 5) { // Nightstand: w=45, h=50
          gc = `<!-- Generated Nightstand -->
               <rect x="4" y="4" width="37" height="42" rx="3" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
               <rect x="8" y="10" width="29" height="12" rx="1" fill="rgba(255,255,255,0.15)" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
               <rect x="8" y="26" width="29" height="12" rx="1" fill="rgba(255,255,255,0.15)" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
               <circle cx="22.5" cy="16" r="1.5" fill="#FFD700"/>
               <circle cx="22.5" cy="32" r="1.5" fill="#FFD700"/>`;
        }
      } else if (itemId.startsWith('dec_gen_')) {
        const idx = parseInt(itemId.replace('dec_gen_', ''));
        const typeIndex = (idx - 1) % 6;
        const item = GAME_DATA.shops.decor.items.find(i => i.id === itemId);
        const color = item?.color || '#3498DB';
        
        if (typeIndex === 0) { // Painting: w=60, h=45
          gc = `<!-- Generated Painting -->
               <rect x="5" y="5" width="50" height="35" fill="${color}" stroke="#8B5A2B" stroke-width="3" rx="1"/>
               <circle cx="30" cy="20" r="8" fill="#FFFACD" opacity="0.8"/>
               <polygon points="10,32 25,22 40,32" fill="#E67E22" opacity="0.9"/>`;
        } else if (typeIndex === 1) { // Flower Vase: w=35, h=50
          gc = `<!-- Generated Flower Vase -->
               <path d="M12 25 L23 25 L20 45 L15 45 Z" fill="${color}" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
               <path d="M17 12 Q20 2 24 16" fill="none" stroke="#2ECC71" stroke-width="1.5"/>
               <path d="M17 12 Q12 4 11 18" fill="none" stroke="#2ECC71" stroke-width="1.5"/>
               <circle cx="24" cy="16" r="4.5" fill="#E74C3C"/>
               <circle cx="11" cy="18" r="4.5" fill="#F1C40F"/>`;
        } else if (typeIndex === 2) { // Soft Rug: w=65, h=30
          gc = `<!-- Generated Rug -->
               <ellipse cx="32" cy="15" rx="30" ry="12" fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="3 2"/>`;
        } else if (typeIndex === 3) { // Clock: w=40, h=40
          gc = `<!-- Generated Clock -->
               <circle cx="20" cy="20" r="18" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
               <circle cx="20" cy="20" r="14" fill="#FFF"/>
               <line x1="20" y1="20" x2="20" y2="10" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
               <line x1="20" y1="20" x2="26" y2="20" stroke="#333" stroke-width="1" stroke-linecap="round"/>`;
        } else if (typeIndex === 4) { // Plant Pot: w=30, h=40
          gc = `<!-- Generated Plant Pot -->
               <rect x="8" y="25" width="14" height="12" fill="#D35400" rx="1"/>
               <path d="M15 25 Q15 5 8 8" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
               <path d="M15 25 Q20 8 22 12" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
        } else if (typeIndex === 5) { // Candle: w=25, h=35
          gc = `<!-- Generated Candle -->
               <rect x="7" y="12" width="11" height="20" fill="${color}" rx="1"/>
               <line x1="12.5" y1="12" x2="12.5" y2="8" stroke="#333" stroke-width="1"/>
               <path d="M12.5 8 Q15 4 12.5 1 Q10 4 12.5 8" fill="#F39C12"/>`;
        }
      }
      return `<svg viewBox="0 0 ${dims.w} ${dims.h}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible;">${gc}</svg>`;
    }

    let c = ''; // SVG markup content

    switch (itemId) {
      // --- FURNITURE ---
      case 'fur_bed_single':
        c = `
          <!-- Legs -->
          <rect x="10" y="48" width="6" height="10" fill="#8B5A2B" />
          <rect x="74" y="48" width="6" height="10" fill="#8B5A2B" />
          <!-- Frame -->
          <rect x="5" y="40" width="80" height="8" rx="2" fill="#8B5A2B" stroke="#5C3A21" stroke-width="1.5" />
          <!-- Headboard -->
          <rect x="5" y="15" width="8" height="30" rx="2" fill="#8B5A2B" stroke="#5C3A21" stroke-width="1.5" />
          <!-- Footboard -->
          <rect x="80" y="30" width="6" height="15" rx="1" fill="#8B5A2B" stroke="#5C3A21" stroke-width="1.5" />
          <!-- Mattress -->
          <rect x="13" y="30" width="67" height="12" rx="2" fill="#EAECEE" stroke="#BDC3C7" stroke-width="1" />
          <!-- Sheet -->
          <rect x="13" y="34" width="67" height="8" fill="#3498DB" />
          <!-- Pillow -->
          <rect x="17" y="24" width="16" height="8" rx="3" fill="#FFF" stroke="#BDC3C7" stroke-width="1" />
          <!-- Blanket -->
          <path d="M 45,34 L 78,34 A 2,2 0 0,1 80,36 L 80,42 L 45,42 Z" fill="#2980B9" />
        `;
        break;

      case 'fur_bed_double':
        c = `
          <!-- Legs -->
          <rect x="15" y="65" width="8" height="12" fill="#5C3A21" />
          <rect x="102" y="65" width="8" height="12" fill="#5C3A21" />
          <!-- Frame -->
          <rect x="10" y="55" width="105" height="10" rx="2" fill="#5C3A21" stroke="#3E2723" stroke-width="2" />
          <!-- Headboard -->
          <rect x="10" y="20" width="10" height="40" rx="3" fill="#5C3A21" stroke="#3E2723" stroke-width="2" />
          <!-- Mattress -->
          <rect x="20" y="40" width="95" height="18" rx="3" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1" />
          <!-- Sheet -->
          <rect x="20" y="45" width="95" height="13" fill="#E74C3C" />
          <!-- Pillows -->
          <rect x="25" y="32" width="22" height="10" rx="4" fill="#FFFFFF" stroke="#BDC3C7" stroke-width="1" />
          <rect x="30" y="35" width="22" height="10" rx="4" fill="#FFF" stroke="#BDC3C7" stroke-width="1" opacity="0.9" />
          <!-- Blanket -->
          <path d="M 60,45 L 112,45 A 2,2 0 0,1 114,47 L 114,57 L 60,57 Z" fill="#C0392B" />
          <line x1="68" y1="45" x2="68" y2="57" stroke="#FFD700" stroke-width="2" />
        `;
        break;

      case 'fur_pet_bed':
        c = `
          <!-- Outer cushion border / basket -->
          <ellipse cx="30" cy="25" rx="28" ry="15" fill="#E67E22" stroke="#D35400" stroke-width="2"/>
          <!-- Inner soft pillow -->
          <ellipse cx="30" cy="22" rx="24" ry="11" fill="#FADBD8" />
          <!-- Paw print decoration -->
          <circle cx="30" cy="22" r="3" fill="#E74C3C"/>
          <circle cx="26" cy="17" r="1.5" fill="#E74C3C"/>
          <circle cx="30" cy="15" r="1.5" fill="#E74C3C"/>
          <circle cx="34" cy="17" r="1.5" fill="#E74C3C"/>
        `;
        break;

      case 'fur_desk_study':
        c = `
          <!-- Desktop -->
          <rect x="5" y="30" width="75" height="6" rx="2" fill="#D2B48C" stroke="#8B5A2B" stroke-width="1.5" />
          <!-- Left cabinet -->
          <rect x="10" y="36" width="20" height="30" fill="#CD853F" stroke="#8B5A2B" stroke-width="1.5" />
          <!-- Drawers line -->
          <line x1="10" y1="46" x2="30" y2="46" stroke="#8B5A2B" stroke-width="1.5" />
          <line x1="10" y1="56" x2="30" y2="56" stroke="#8B5A2B" stroke-width="1.5" />
          <!-- Drawer knobs -->
          <circle cx="20" cy="41" r="2" fill="#FFD700" />
          <circle cx="20" cy="51" r="2" fill="#FFD700" />
          <circle cx="20" cy="61" r="2" fill="#FFD700" />
          <!-- Right Leg -->
          <rect x="65" y="36" width="6" height="30" fill="#8B5A2B" />
          <!-- Laptop -->
          <path d="M 40,30 L 55,30 L 52,22 L 43,22 Z" fill="#34495E" />
        `;
        break;

      case 'fur_chair_spin':
        c = `
          <!-- Backrest -->
          <rect x="12" y="15" width="26" height="25" rx="5" fill="#3498DB" stroke="#2980B9" stroke-width="2" />
          <!-- Cushion -->
          <rect x="9" y="40" width="32" height="6" rx="2" fill="#2980B9" stroke="#1F618D" stroke-width="2" />
          <!-- Column -->
          <rect x="23" y="46" width="4" height="15" fill="#BDC3C7" />
          <!-- Base -->
          <path d="M 12,61 L 38,61" stroke="#7F8C8D" stroke-width="3" stroke-linecap="round" />
          <!-- Wheels -->
          <circle cx="14" cy="64" r="3" fill="#333" />
          <circle cx="36" cy="64" r="3" fill="#333" />
        `;
        break;

      case 'fur_wardrobe':
        c = `
          <!-- Main cabinet -->
          <rect x="5" y="5" width="65" height="100" rx="5" fill="#8B4513" stroke="#5C3A21" stroke-width="2" />
          <!-- Doors -->
          <rect x="9" y="9" width="27" height="92" rx="2" fill="#A0522D" />
          <rect x="38" y="9" width="27" height="92" rx="2" fill="#A0522D" />
          <!-- Handles -->
          <rect x="32" y="50" width="3" height="12" rx="1" fill="#FFD700" />
          <rect x="40" y="50" width="3" height="12" rx="1" fill="#FFD700" />
        `;
        break;

      case 'fur_tv':
        c = `
          <!-- Bezel -->
          <rect x="2" y="2" width="96" height="58" rx="4" fill="#2C3E50" stroke="#1A252F" stroke-width="2" />
          <!-- Screen -->
          <rect x="6" y="6" width="88" height="50" fill="#1A1A1A" />
          <!-- Reflection -->
          <path d="M 6,6 L 50,6 L 6,50 Z" fill="rgba(255,255,255,0.08)" />
          <!-- Neck -->
          <rect x="46" y="60" width="8" height="10" fill="#34495E" />
          <!-- Base -->
          <ellipse cx="50" cy="70" rx="18" ry="4" fill="#2C3E50" />
        `;
        break;

      case 'fur_fridge':
        c = `
          <!-- Body -->
          <rect x="5" y="5" width="55" height="100" rx="6" fill="#7F8C8D" stroke="#566573" stroke-width="2" />
          <!-- Top Freezer -->
          <rect x="8" y="8" width="49" height="38" rx="3" fill="#BDC3C7" />
          <!-- Bottom Fridge -->
          <rect x="8" y="50" width="49" height="52" rx="3" fill="#BDC3C7" />
          <!-- Handles -->
          <rect x="12" y="20" width="4" height="15" rx="1" fill="#95A5A6" />
          <rect x="12" y="60" width="4" height="20" rx="1" fill="#95A5A6" />
          <!-- Magnet details -->
          <circle cx="40" cy="18" r="3" fill="#E74C3C" />
          <rect x="42" y="24" width="6" height="6" fill="#F1C40F" />
        `;
        break;

      case 'fur_sofa':
        c = `
          <!-- Base -->
          <rect x="10" y="42" width="100" height="15" rx="2" fill="#D35400" stroke="#A04000" stroke-width="1.5" />
          <!-- Backrest -->
          <rect x="10" y="15" width="100" height="30" rx="6" fill="#E67E22" stroke="#D35400" stroke-width="1.5" />
          <!-- Armrests -->
          <rect x="2" y="30" width="12" height="27" rx="5" fill="#E67E22" stroke="#D35400" stroke-width="1.5" />
          <rect x="106" y="30" width="12" height="27" rx="5" fill="#E67E22" stroke="#D35400" stroke-width="1.5" />
          <!-- Pillows -->
          <rect x="16" y="28" width="14" height="14" rx="2" fill="#F1C40F" transform="rotate(-15 16 28)" />
          <rect x="88" y="28" width="14" height="14" rx="2" fill="#F1C40F" transform="rotate(15 88 28)" />
          <!-- Cushion divides -->
          <line x1="43" y1="42" x2="43" y2="57" stroke="#A04000" stroke-width="1" />
          <line x1="77" y1="42" x2="77" y2="57" stroke="#A04000" stroke-width="1" />
        `;
        break;

      case 'fur_coffee_table':
        c = `
          <!-- Legs -->
          <rect x="12" y="20" width="4" height="20" fill="#5C3A21" />
          <rect x="54" y="20" width="4" height="20" fill="#5C3A21" />
          <!-- Lower shelf -->
          <rect x="10" y="30" width="50" height="3" fill="#D2B48C" />
          <!-- Table Top -->
          <rect x="5" y="15" width="60" height="6" rx="2" fill="#8B5A2B" stroke="#5C3A21" stroke-width="1.5" />
          <!-- Cup -->
          <path d="M 32,10 L 38,10 L 37,15 L 33,15 Z" fill="#FFF" />
          <path d="M 38,11 C 40,11 40,14 38,14" stroke="#FFF" stroke-width="1" fill="none" />
        `;
        break;

      case 'fur_rug':
        c = `
          <!-- Rug -->
          <ellipse cx="55" cy="22" rx="52" ry="18" fill="#1ABC9C" stroke="#16A085" stroke-width="2" />
          <ellipse cx="55" cy="22" rx="46" ry="13" fill="none" stroke="#FFF" stroke-width="1.5" stroke-dasharray="3,3" />
          <!-- Star pattern -->
          <polygon points="55,12 57,17 62,17 58,20 60,25 55,22 50,25 52,20 48,17 53,17" fill="#F1C40F" />
        `;
        break;

      case 'fur_nightstand':
        c = `
          <!-- Main cabinet -->
          <rect x="5" y="5" width="35" height="40" rx="3" fill="#CD853F" stroke="#8B5A2B" stroke-width="1.5" />
          <!-- Drawers -->
          <rect x="8" y="10" width="29" height="12" rx="2" fill="#D2B48C" stroke="#8B5A2B" stroke-width="1" />
          <rect x="8" y="26" width="29" height="12" rx="2" fill="#D2B48C" stroke="#8B5A2B" stroke-width="1" />
          <!-- Knobs -->
          <circle cx="22.5" cy="16" r="2" fill="#FFD700" />
          <circle cx="22.5" cy="32" r="2" fill="#FFD700" />
        `;
        break;

      case 'fur_bookshelf':
        c = `
          <!-- Cabinet frame -->
          <rect x="5" y="5" width="70" height="100" rx="4" fill="#8B4513" stroke="#5C3A21" stroke-width="2" />
          <!-- Shelves -->
          <line x1="5" y1="38" x2="75" y2="38" stroke="#5C3A21" stroke-width="2.5" />
          <line x1="5" y1="70" x2="75" y2="70" stroke="#5C3A21" stroke-width="2.5" />
          <!-- Books on shelves -->
          <!-- Row 1 -->
          <rect x="12" y="12" width="8" height="26" fill="#E74C3C" />
          <rect x="20" y="10" width="10" height="28" fill="#3498DB" />
          <rect x="30" y="15" width="6" height="23" fill="#F1C40F" />
          <rect x="38" y="18" width="8" height="20" fill="#2ECC71" transform="rotate(15 38 18)" />
          <!-- Row 2 -->
          <rect x="15" y="45" width="7" height="25" fill="#9B59B6" />
          <rect x="22" y="42" width="9" height="28" fill="#1ABC9C" />
          <rect x="45" y="48" width="12" height="22" fill="#E67E22" transform="rotate(-10 45 48)" />
          <!-- Row 3 -->
          <rect x="25" y="75" width="10" height="25" fill="#E74C3C" />
          <rect x="35" y="73" width="7" height="27" fill="#F1C40F" />
          <rect x="42" y="78" width="8" height="22" fill="#3498DB" />
        `;
        break;

      case 'fur_lamp_stand':
        c = `
          <!-- Base -->
          <ellipse cx="20" cy="95" rx="12" ry="3" fill="#34495E" />
          <!-- Glow -->
          <polygon points="20,30 2,90 38,90" fill="#F1C40F" opacity="0.15" />
          <!-- Pole -->
          <line x1="20" y1="30" x2="20" y2="95" stroke="#7F8C8D" stroke-width="3" />
          <!-- Shade -->
          <polygon points="8,30 32,30 26,10 14,10" fill="#F1C40F" stroke="#D35400" stroke-width="1.5" />
        `;
        break;

      case 'fur_vanity':
        c = `
          <!-- Desk top -->
          <rect x="5" y="45" width="65" height="6" rx="2" fill="#FFF0F5" stroke="#C8A2C8" stroke-width="1.5" />
          <!-- Drawers -->
          <rect x="10" y="51" width="55" height="35" rx="2" fill="#FFF0F5" stroke="#C8A2C8" stroke-width="1.5" />
          <line x1="10" y1="68" x2="65" y2="68" stroke="#C8A2C8" stroke-width="1" />
          <circle cx="37.5" cy="60" r="2.5" fill="#C8A2C8" />
          <!-- Mirror -->
          <ellipse cx="37.5" cy="25" rx="18" ry="20" fill="#ADE8F4" stroke="#FFF" stroke-width="3" />
          <line x1="34" y1="40" x2="40" y2="40" stroke="#CD853F" stroke-width="2" />
        `;
        break;

      case 'fur_armchair':
        c = `
          <!-- Legs -->
          <rect x="12" y="53" width="5" height="8" fill="#7F8C8D" />
          <rect x="48" y="53" width="5" height="8" fill="#7F8C8D" />
          <!-- Cushions -->
          <rect x="8" y="38" width="49" height="15" rx="3" fill="#1ABC9C" stroke="#16A085" stroke-width="1.5" />
          <rect x="8" y="10" width="49" height="30" rx="6" fill="#1ABC9C" stroke="#16A085" stroke-width="1.5" />
          <!-- Armrests -->
          <rect x="2" y="25" width="8" height="26" rx="4" fill="#1ABC9C" stroke="#16A085" stroke-width="1.5" />
          <rect x="55" y="25" width="8" height="26" rx="4" fill="#1ABC9C" stroke="#16A085" stroke-width="1.5" />
        `;
        break;

      case 'fur_computer':
        c = `
          <!-- Stand -->
          <path d="M 26,35 L 34,35 L 32,46 L 28,46 Z" fill="#BDC3C7" />
          <!-- Frame -->
          <rect x="5" y="5" width="50" height="30" rx="3" fill="#2C3E50" stroke="#1A252F" stroke-width="2" />
          <!-- Screen -->
          <rect x="8" y="8" width="44" height="24" fill="#3498DB" />
          <!-- Keyboard -->
          <rect x="10" y="48" width="30" height="3" rx="1" fill="#7F8C8D" />
          <!-- Mouse -->
          <circle cx="45" cy="49.5" r="2" fill="#333" />
        `;
        break;

      case 'fur_plant_pot':
        c = `
          <!-- Pot -->
          <polygon points="12,50 38,50 34,78 16,78" fill="#D35400" stroke="#A04000" stroke-width="2" />
          <rect x="10" y="47" width="30" height="4" rx="1" fill="#D35400" />
          <!-- Stems -->
          <path d="M 25,50 Q 20,30 15,15" fill="none" stroke="#27AE60" stroke-width="3" />
          <path d="M 25,50 Q 30,32 35,20" fill="none" stroke="#27AE60" stroke-width="3" />
          <!-- Leaves -->
          <ellipse cx="15" cy="15" rx="8" ry="12" fill="#2ECC71" transform="rotate(-30 15 15)" />
          <ellipse cx="35" cy="20" rx="8" ry="12" fill="#2ECC71" transform="rotate(30 35 20)" />
          <ellipse cx="22" cy="30" rx="10" ry="15" fill="#27AE60" transform="rotate(-10 22 30)" />
        `;
        break;

      case 'fur_mirror':
        c = `
          <!-- Mirror wood stand -->
          <rect x="5" y="5" width="35" height="100" rx="10" fill="#8B4513" stroke="#5C3A21" stroke-width="2" />
          <!-- Mirror glass -->
          <rect x="9" y="9" width="27" height="92" rx="8" fill="#E0F7FA" />
          <line x1="12" y1="12" x2="33" y2="85" stroke="#FFF" stroke-width="1.5" opacity="0.3" />
          <rect x="2" y="102" width="41" height="5" rx="2" fill="#5C3A21" />
        `;
        break;

      case 'fur_microwave':
        c = `
          <!-- Body -->
          <rect x="2" y="2" width="51" height="36" rx="4" fill="#34495E" stroke="#2C3E50" stroke-width="2" />
          <!-- Door screen -->
          <rect x="6" y="8" width="30" height="24" rx="2" fill="#1A1A1A" stroke="#7F8C8D" />
          <!-- Buttons -->
          <rect x="40" y="8" width="9" height="24" fill="#1A1A1A" />
          <circle cx="44.5" cy="12" r="1.5" fill="#E74C3C" />
          <circle cx="44.5" cy="16" r="1.5" fill="#2ECC71" />
        `;
        break;

      case 'fur_washer':
        c = `
          <!-- Body -->
          <rect x="5" y="5" width="55" height="65" rx="5" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="2" />
          <!-- Controls -->
          <rect x="8" y="8" width="49" height="12" fill="#BDC3C7" />
          <circle cx="15" cy="14" r="2.5" fill="#3498DB" />
          <!-- Door -->
          <circle cx="32.5" cy="42" r="18" fill="#FFF" stroke="#BDC3C7" stroke-width="2" />
          <circle cx="32.5" cy="42" r="12" fill="#AED6F1" opacity="0.6" />
        `;
        break;

      // --- DECOR ---
      case 'dec_painting':
        c = `
          <!-- Frame -->
          <rect x="2" y="2" width="56" height="41" rx="2" fill="#A0522D" stroke="#5C3A21" stroke-width="2" />
          <!-- Art canvas -->
          <rect x="6" y="6" width="48" height="33" fill="#85C1E9" />
          <!-- Drawing -->
          <polygon points="6,39 24,18 42,39" fill="#2E4053" />
          <circle cx="42" cy="14" r="5" fill="#F1C40F" />
        `;
        break;

      case 'dec_plant_small':
        c = `
          <!-- Pot -->
          <polygon points="6,25 24,25 21,38 9,38" fill="#E67E22" stroke="#A04000" />
          <!-- Cactus -->
          <rect x="12" y="10" width="6" height="16" rx="3" fill="#27AE60" />
          <path d="M 12,18 L 8,18 L 8,12" fill="none" stroke="#27AE60" stroke-width="3" stroke-linecap="round" />
          <path d="M 18,15 L 22,15 L 22,10" fill="none" stroke="#27AE60" stroke-width="3" stroke-linecap="round" />
        `;
        break;

      case 'dec_led_lights':
        c = `
          <!-- Wire -->
          <path d="M 5,10 Q 30,25 60,10 T 115,10" fill="none" stroke="#7F8C8D" stroke-width="2" />
          <!-- Bulbs -->
          <circle cx="15" cy="13" r="3" fill="#F1C40F" /><circle cx="15" cy="13" r="6" fill="#F1C40F" opacity="0.4" />
          <circle cx="45" cy="16" r="3" fill="#F1C40F" /><circle cx="45" cy="16" r="6" fill="#F1C40F" opacity="0.4" />
          <circle cx="75" cy="15" r="3" fill="#F1C40F" /><circle cx="75" cy="15" r="6" fill="#F1C40F" opacity="0.4" />
          <circle cx="105" cy="12" r="3" fill="#F1C40F" /><circle cx="105" cy="12" r="6" fill="#F1C40F" opacity="0.4" />
        `;
        break;

      case 'dec_photo_frame':
        c = `
          <!-- Frame -->
          <rect x="2" y="2" width="31" height="36" rx="2" fill="#D2B48C" stroke="#8B5A2B" stroke-width="1.5" />
          <!-- Paper -->
          <rect x="5" y="5" width="25" height="30" fill="#FFF" />
          <!-- Face -->
          <circle cx="17.5" cy="20" r="7" fill="#F1C40F" />
          <circle cx="15" cy="18" r="1" fill="#333" />
          <circle cx="20" cy="18" r="1" fill="#333" />
          <path d="M 15,22 Q 17.5,25 20,22" stroke="#333" stroke-width="1" fill="none" />
        `;
        break;

      case 'dec_doormat':
        c = `
          <!-- Mat -->
          <path d="M 5,15 C 5,5 65,5 65,15 L 65,22 C 65,26 5,26 5,22 Z" fill="#E74C3C" stroke="#C0392B" stroke-width="1.5" />
          <text x="35" y="19" fill="#FFF" font-size="8" font-weight="bold" text-anchor="middle">HI! 👋</text>
        `;
        break;

      case 'dec_curtain':
        c = `
          <!-- Rod -->
          <rect x="2" y="5" width="96" height="4" fill="#7F8C8D" />
          <!-- Curtains -->
          <path d="M 10,9 L 30,9 L 18,85 L 10,85 Z" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1.5" />
          <path d="M 70,9 L 90,9 L 90,85 L 82,85 Z" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1.5" />
          <rect x="10" y="45" width="12" height="4" fill="#FFD700" />
          <rect x="78" y="45" width="12" height="4" fill="#FFD700" />
        `;
        break;

      case 'dec_cushion':
        c = `
          <!-- Pillow cushion -->
          <rect x="5" y="5" width="25" height="25" rx="8" fill="#F1C40F" stroke="#F39C12" stroke-width="1.5" transform="rotate(45 17.5 17.5)" />
          <circle cx="17.5" cy="17.5" r="3" fill="#D35400" />
        `;
        break;

      case 'dec_clock':
        c = `
          <!-- Ring -->
          <circle cx="20" cy="20" r="18" fill="#34495E" stroke="#2C3E50" stroke-width="2" />
          <circle cx="20" cy="20" r="14" fill="#FFFFFF" />
          <line x1="20" y1="20" x2="20" y2="10" stroke="#333" stroke-width="2" stroke-linecap="round" />
          <line x1="20" y1="20" x2="27" y2="20" stroke="#333" stroke-width="1.5" stroke-linecap="round" />
        `;
        break;

      case 'dec_xmas_tree':
        c = `
          <!-- Trunk -->
          <rect x="32" y="78" width="6" height="15" fill="#8B4513" />
          <!-- Green Pine levels -->
          <polygon points="35,10 15,45 55,45" fill="#27AE60" stroke="#1E8449" />
          <polygon points="35,30 10,65 60,65" fill="#2ECC71" stroke="#27AE60" />
          <polygon points="35,50 5,80 65,80" fill="#27AE60" stroke="#1E8449" />
          <!-- Star -->
          <polygon points="35,3 37,8 42,8 38,11 40,16 35,13 30,16 32,11 28,8 33,8" fill="#FFD700" />
          <!-- Bulbs -->
          <circle cx="25" cy="40" r="3" fill="#E74C3C" />
          <circle cx="45" cy="60" r="3" fill="#F1C40F" />
          <circle cx="35" cy="70" r="3" fill="#E74C3C" />
        `;
        break;

      case 'dec_flower_vase':
        c = `
          <!-- Stems -->
          <line x1="17" y1="12" x2="13" y2="25" stroke="#27AE60" stroke-width="2" />
          <line x1="17" y1="12" x2="22" y2="25" stroke="#27AE60" stroke-width="2" />
          <!-- Flowers -->
          <circle cx="10" cy="10" r="4" fill="#FF6B6B" />
          <circle cx="25" cy="11" r="4" fill="#FFB6C1" />
          <!-- Vase -->
          <path d="M12,22 Q7,45 17,45 Q27,45 22,22 Z" fill="#90E0EF" stroke="#48CAE4" stroke-width="1.5" />
        `;
        break;

      case 'dec_candle':
        c = `
          <!-- Jar -->
          <rect x="4" y="12" width="17" height="20" rx="3" fill="#FFF" stroke="#BDC3C7" stroke-width="1.5" opacity="0.8" />
          <rect x="5" y="16" width="15" height="15" fill="#F39C12" />
          <line x1="12.5" y1="12" x2="12.5" y2="15" stroke="#333" stroke-width="1" />
          <!-- Flame -->
          <path d="M12.5,3 C14.5,7 12.5,12 12.5,12 C12.5,12 10.5,7 12.5,3 Z" fill="#FF8C00" />
        `;
        break;

      case 'dec_wall_hook':
        c = `
          <!-- Hanger Board -->
          <rect x="5" y="6" width="40" height="8" rx="2" fill="#D2B48C" stroke="#8B5A2B" stroke-width="1.5" />
          <!-- Hook Pegs -->
          <path d="M 12,14 L 12,18 A 2,2 0 0,0 16,18" fill="none" stroke="#7F8C8D" stroke-width="2" stroke-linecap="round" />
          <path d="M 25,14 L 25,18 A 2,2 0 0,0 29,18" fill="none" stroke="#7F8C8D" stroke-width="2" stroke-linecap="round" />
          <path d="M 38,14 L 38,18 A 2,2 0 0,0 42,18" fill="none" stroke="#7F8C8D" stroke-width="2" stroke-linecap="round" />
        `;
        break;

      case 'dec_windchime':
        c = `
          <!-- Hanger -->
          <line x1="15" y1="2" x2="15" y2="15" stroke="#7F8C8D" stroke-width="1" />
          <!-- Bell -->
          <path d="M7,25 C7,15 23,15 23,25 Z" fill="#AED6F1" stroke="#3498DB" stroke-width="1.5" opacity="0.9" />
          <!-- Paper Leaf -->
          <rect x="13.5" y="32" width="3" height="25" fill="#E74C3C" />
        `;
        break;

      case 'dec_music_box':
        c = `
          <!-- Base Box -->
          <rect x="5" y="15" width="25" height="15" rx="3" fill="#CD853F" stroke="#8B5A2B" stroke-width="1.5" />
          <!-- Handle -->
          <path d="M 17,15 L 17,8 L 24,8" stroke="#BDC3C7" stroke-width="2" stroke-linecap="round" fill="none" />
          <text x="26" y="10" fill="#E74C3C" font-size="8">🎵</text>
        `;
        break;

      case 'dec_poster':
        c = `
          <!-- Paper sheet -->
          <rect x="4" y="4" width="37" height="52" fill="#FEF9E7" stroke="#F4D03F" stroke-width="1.5" />
          <!-- Drawing details -->
          <circle cx="22" cy="25" r="10" fill="#F5B041" />
          <circle cx="19" cy="23" r="1" fill="#333" />
          <circle cx="25" cy="23" r="1" fill="#333" />
          <path d="M 19,27 Q 22,30 25,27" stroke="#333" stroke-width="1.5" fill="none" />
          <!-- Pins -->
          <circle cx="6" cy="6" r="2" fill="#E74C3C" />
          <circle cx="39" cy="6" r="2" fill="#E74C3C" />
        `;
        break;

      case 'fur_bunk_bed':
        c = `
          <!-- Bottom Bed Frame -->
          <rect x="12" y="75" width="70" height="22" fill="#5D4037" stroke="#3E2723" stroke-width="1.5"/>
          <rect x="16" y="78" width="62" height="8" fill="#AED6F1"/>
          <rect x="18" y="70" width="15" height="8" rx="2" fill="#FFF"/>
          <!-- Top Bed Frame -->
          <rect x="12" y="25" width="70" height="18" fill="#5D4037" stroke="#3E2723" stroke-width="1.5"/>
          <rect x="16" y="28" width="62" height="8" fill="#FADBD8"/>
          <rect x="18" y="21" width="15" height="7" rx="2" fill="#FFF"/>
          <!-- Guard rail -->
          <rect x="35" y="20" width="45" height="6" fill="#3E2723"/>
          <!-- Posts -->
          <rect x="8" y="10" width="6" height="92" fill="#3E2723"/>
          <rect x="80" y="10" width="6" height="92" fill="#3E2723"/>
          <!-- Ladder -->
          <rect x="68" y="25" width="4" height="72" fill="#D35400"/>
          <rect x="74" y="25" width="4" height="72" fill="#D35400"/>
          <line x1="68" y1="40" x2="78" y2="40" stroke="#D35400" stroke-width="3"/>
          <line x1="68" y1="55" x2="78" y2="55" stroke="#D35400" stroke-width="3"/>
          <line x1="68" y1="70" x2="78" y2="70" stroke="#D35400" stroke-width="3"/>
          <line x1="68" y1="85" x2="78" y2="85" stroke="#D35400" stroke-width="3"/>
        `;
        break;

      case 'fur_gaming_chair':
        c = `
          <!-- Wheels base -->
          <path d="M10 70 L45 70 M27 62 L27 70" stroke="#2C3E50" stroke-width="4" stroke-linecap="round"/>
          <circle cx="10" cy="72" r="3" fill="#111"/>
          <circle cx="27" cy="72" r="3" fill="#111"/>
          <circle cx="45" cy="72" r="3" fill="#111"/>
          <!-- Lift cylinder -->
          <rect x="24" y="52" width="6" height="12" fill="#7F8C8D"/>
          <!-- Seat Cushion -->
          <rect x="12" y="44" width="31" height="8" rx="2" fill="#1A1A1A" stroke="#E74C3C" stroke-width="1.5"/>
          <!-- Armrests -->
          <path d="M10 38 L10 46 M45 38 L45 46" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>
          <!-- Backrest -->
          <path d="M15 10 L40 10 L37 44 L18 44 Z" fill="#1A1A1A" stroke="#E74C3C" stroke-width="2"/>
          <rect x="20" y="14" width="15" height="8" fill="#E74C3C" rx="1"/> <!-- Head cushion -->
        `;
        break;

      case 'fur_dining_table':
        c = `
          <!-- Tabletop -->
          <rect x="5" y="15" width="90" height="12" rx="3" fill="#CD853F" stroke="#8B5A2B" stroke-width="2"/>
          <!-- Table Runner -->
          <rect x="35" y="15" width="30" height="13" fill="#ECF0F1"/>
          <!-- Center decoration (bowl) -->
          <path d="M43 15 L57 15 L54 10 L46 10 Z" fill="#1ABC9C"/>
          <circle cx="50" cy="7" r="2" fill="#E74C3C"/>
          <!-- Legs -->
          <rect x="12" y="27" width="8" height="30" fill="#8B5A2B"/>
          <rect x="80" y="27" width="8" height="30" fill="#8B5A2B"/>
        `;
        break;

      case 'fur_dining_chair':
        c = `
          <!-- Legs -->
          <rect x="8" y="36" width="5" height="26" fill="#8B5A2B"/>
          <rect x="32" y="36" width="5" height="26" fill="#8B5A2B"/>
          <!-- Seat -->
          <rect x="5" y="30" width="35" height="6" rx="1" fill="#CD853F" stroke="#8B5A2B" stroke-width="1"/>
          <!-- Backrest -->
          <rect x="8" y="5" width="29" height="25" fill="none" stroke="#8B5A2B" stroke-width="2"/>
          <line x1="15" y1="5" x2="15" y2="30" stroke="#8B5A2B" stroke-width="1.5"/>
          <line x1="22" y1="5" x2="22" y2="30" stroke="#8B5A2B" stroke-width="1.5"/>
          <line x1="29" y1="5" x2="29" y2="30" stroke="#8B5A2B" stroke-width="1.5"/>
        `;
        break;

      case 'fur_kitchen_cabinet':
        c = `
          <!-- Counter Base -->
          <rect x="5" y="25" width="80" height="52" fill="#EAECEE" stroke="#BDC3C7" stroke-width="2"/>
          <!-- Counter Top -->
          <rect x="2" y="20" width="86" height="6" rx="1" fill="#34495E"/>
          <!-- Sink faucet -->
          <path d="M22 20 L22 10 L16 10" fill="none" stroke="#BDC3C7" stroke-width="2" stroke-linecap="round"/>
          <path d="M18 20 L28 20 L28 24 L18 24 Z" fill="#95A5A6"/> <!-- sink basin -->
          <!-- Cabinet Doors -->
          <rect x="12" y="36" width="28" height="35" fill="#FFF" stroke="#BDC3C7" stroke-width="1.5"/>
          <rect x="48" y="36" width="28" height="35" fill="#FFF" stroke="#BDC3C7" stroke-width="1.5"/>
          <circle cx="34" cy="54" r="2.5" fill="#7F8C8D"/>
          <circle cx="54" cy="54" r="2.5" fill="#7F8C8D"/>
        `;
        break;

      case 'fur_piano':
        c = `
          <!-- Main Body -->
          <rect x="5" y="5" width="85" height="50" fill="#1A1A1A" stroke="#000" stroke-width="2"/>
          <!-- Fallboard / Music Stand -->
          <rect x="10" y="20" width="75" height="4" fill="#2C3E50"/>
          <path d="M40 20 L48 8 L54 18" stroke="#FFF" stroke-width="1" fill="none"/> <!-- sheet music -->
          <!-- Keys bed -->
          <rect x="2" y="52" width="91" height="10" fill="#FFF" stroke="#000" stroke-width="1.5"/>
          <!-- Black Keys details (draw some lines) -->
          <line x1="10" y1="52" x2="10" y2="58" stroke="#000" stroke-width="2"/>
          <line x1="20" y1="52" x2="20" y2="58" stroke="#000" stroke-width="2"/>
          <line x1="30" y1="52" x2="30" y2="58" stroke="#000" stroke-width="2"/>
          <line x1="40" y1="52" x2="40" y2="58" stroke="#000" stroke-width="2"/>
          <line x1="50" y1="52" x2="50" y2="58" stroke="#000" stroke-width="2"/>
          <line x1="60" y1="52" x2="60" y2="58" stroke="#000" stroke-width="2"/>
          <line x1="70" y1="52" x2="70" y2="58" stroke="#000" stroke-width="2"/>
          <line x1="80" y1="52" x2="80" y2="58" stroke="#000" stroke-width="2"/>
          <!-- Legs -->
          <rect x="8" y="62" width="8" height="20" fill="#1A1A1A"/>
          <rect x="79" y="62" width="8" height="20" fill="#1A1A1A"/>
          <!-- Pedals -->
          <circle cx="43" cy="80" r="2" fill="#FFD700"/>
          <circle cx="48" cy="80" r="2" fill="#FFD700"/>
          <circle cx="53" cy="80" r="2" fill="#FFD700"/>
        `;
        break;

      case 'fur_beanbag':
        c = `
          <!-- Soft round bag -->
          <ellipse cx="32" cy="28" rx="28" ry="20" fill="#2980B9" stroke="#1F618D" stroke-width="2"/>
          <ellipse cx="32" cy="20" rx="18" ry="12" fill="#3498DB"/>
          <!-- Folds details -->
          <path d="M12 28 Q32 38 52 28" fill="none" stroke="#1F618D" stroke-width="1.5"/>
          <path d="M22 16 Q32 24 42 16" fill="none" stroke="#1F618D" stroke-width="1"/>
        `;
        break;

      case 'fur_aquarium':
        c = `
          <!-- Stand -->
          <rect x="8" y="45" width="59" height="18" fill="#5D4037"/>
          <!-- Glass Tank -->
          <rect x="12" y="10" width="51" height="35" rx="2" fill="#E8F8F5" stroke="#7F8C8D" stroke-width="2"/>
          <!-- Water -->
          <rect x="14" y="14" width="47" height="29" fill="#AED6F1" opacity="0.7"/>
          <!-- Seaweed -->
          <path d="M20 43 Q18 30 22 22 Q24 30 22 43" fill="#27AE60"/>
          <path d="M52 43 Q54 32 50 25 Q48 32 50 43" fill="#2E4053" opacity="0.3"/>
          <path d="M54 43 Q56 30 52 22 Q50 30 52 43" fill="#2ECC71"/>
          <!-- Fish -->
          <ellipse cx="36" cy="25" rx="4" ry="2" fill="#E67E22"/>
          <polygon points="40,25 44,22 44,28" fill="#E67E22"/>
          <!-- Bubbles -->
          <circle cx="34" cy="20" r="1" fill="#FFF" opacity="0.8"/>
          <circle cx="35" cy="16" r="1.5" fill="#FFF" opacity="0.8"/>
          <circle cx="28" cy="28" r="1.2" fill="#FFF" opacity="0.6"/>
        `;
        break;

      case 'fur_fireplace':
        c = `
          <!-- Main Brick Arch -->
          <rect x="5" y="20" width="75" height="58" fill="#C0392B" stroke="#922B21" stroke-width="2"/>
          <!-- Inside Opening -->
          <rect x="22" y="38" width="41" height="40" rx="3" fill="#1A1A1A"/>
          <!-- Mantelpiece -->
          <rect x="2" y="14" width="81" height="6" rx="1" fill="#D35400"/>
          <!-- Burning Logs -->
          <rect x="30" y="66" width="25" height="8" rx="1" fill="#5D4037"/>
          <path d="M34 68 C36 50 40 50 42 68 C44 48 48 48 50 68 Z" fill="#E67E22" opacity="0.9"/>
          <path d="M37 68 C39 56 41 56 43 68 C45 54 47 54 49 68 Z" fill="#F1C40F" opacity="0.9"/>
          <!-- Brick grid details -->
          <line x1="20" y1="20" x2="20" y2="38" stroke="#922B21" stroke-width="1.5"/>
          <line x1="65" y1="20" x2="65" y2="38" stroke="#922B21" stroke-width="1.5"/>
        `;
        break;

      case 'fur_tv_cabinet':
        c = `
          <!-- Cabinet Body -->
          <rect x="5" y="25" width="80" height="23" fill="#8B5A2B" stroke="#5D4037" stroke-width="1.5"/>
          <!-- Compartments -->
          <rect x="10" y="29" width="30" height="15" fill="#CD853F"/>
          <rect x="50" y="29" width="30" height="15" fill="#CD853F"/>
          <!-- Knobs -->
          <circle cx="25" cy="36.5" r="2.5" fill="#3E2723"/>
          <circle cx="65" cy="36.5" r="2.5" fill="#3E2723"/>
          <!-- Legs -->
          <rect x="10" y="48" width="6" height="2" fill="#5D4037"/>
          <rect x="74" y="48" width="6" height="2" fill="#5D4037"/>
        `;
        break;

      case 'fur_bookshelf_modern':
        c = `
          <!-- Main Frame -->
          <rect x="5" y="5" width="70" height="90" rx="3" fill="#D2B48C" stroke="#8B5A2B" stroke-width="1.5"/>
          <!-- Shelves -->
          <line x1="5" y1="35" x2="75" y2="35" stroke="#8B5A2B" stroke-width="2"/>
          <line x1="5" y1="65" x2="75" y2="65" stroke="#8B5A2B" stroke-width="2"/>
          <!-- Books on top shelf -->
          <rect x="12" y="15" width="8" height="20" fill="#E74C3C"/>
          <rect x="20" y="12" width="10" height="23" fill="#3498DB"/>
          <rect x="30" y="17" width="7" height="18" fill="#F1C40F"/>
          <!-- Book leaning -->
          <rect x="42" y="18" width="8" height="20" fill="#2ECC71" transform="rotate(15 42 18)"/>
          <!-- Plant on middle shelf -->
          <path d="M50 55 C47 48 53 48 50 55" stroke="#27AE60" stroke-width="3" fill="none"/>
          <ellipse cx="50" cy="60" rx="7" ry="5" fill="#A0522D"/>
          <!-- Items on bottom shelf -->
          <rect x="15" y="75" width="15" height="10" rx="1" fill="#FFF" stroke="#BDC3C7" stroke-width="1"/>
        `;
        break;

      case 'fur_desk_gaming':
        c = `
          <!-- Top Surface -->
          <rect x="2" y="20" width="81" height="8" rx="2" fill="#2C3E50" stroke="#1A252F" stroke-width="1.5"/>
          <!-- Neon strip effect -->
          <rect x="5" y="25" width="75" height="2" fill="#00FFCC" opacity="0.8"/>
          <!-- Legs -->
          <polygon points="8,28 15,28 20,68 12,68" fill="#1A252F"/>
          <polygon points="77,28 70,28 65,68 73,68" fill="#1A252F"/>
          <!-- Crossbar -->
          <rect x="18" y="45" width="49" height="5" fill="#34495E"/>
        `;
        break;

      case 'fur_chest_drawers':
        c = `
          <!-- Frame -->
          <rect x="5" y="5" width="60" height="65" rx="3" fill="#CD853F" stroke="#8B5A2B" stroke-width="2"/>
          <!-- 3 Drawers -->
          <rect x="9" y="9" width="52" height="15" fill="#F5CBA7" stroke="#8B5A2B" stroke-width="1"/>
          <rect x="9" y="27" width="52" height="15" fill="#F5CBA7" stroke="#8B5A2B" stroke-width="1"/>
          <rect x="9" y="45" width="52" height="15" fill="#F5CBA7" stroke="#8B5A2B" stroke-width="1"/>
          <!-- Handles -->
          <rect x="29" y="15" width="12" height="3" rx="1" fill="#8B5A2B"/>
          <rect x="29" y="33" width="12" height="3" rx="1" fill="#8B5A2B"/>
          <rect x="29" y="51" width="12" height="3" rx="1" fill="#8B5A2B"/>
        `;
        break;

      case 'fur_coffee_table_glass':
        c = `
          <!-- Wooden frame -->
          <rect x="5" y="12" width="60" height="8" rx="1" fill="#D2B48C" stroke="#8B5A2B" stroke-width="1.5"/>
          <!-- Glass surface inside -->
          <rect x="10" y="14" width="50" height="4" fill="#AED6F1" opacity="0.6"/>
          <!-- Legs -->
          <rect x="10" y="20" width="5" height="18" fill="#8B5A2B"/>
          <rect x="55" y="20" width="5" height="18" fill="#8B5A2B"/>
          <!-- Shelf below -->
          <line x1="12" y1="28" x2="58" y2="28" stroke="#8B5A2B" stroke-width="1.5"/>
        `;
        break;

      case 'fur_shoe_cabinet':
        c = `
          <!-- Main cabinet body -->
          <rect x="5" y="10" width="55" height="55" rx="3" fill="#D2691E" stroke="#5D4037" stroke-width="1.5"/>
          <!-- Louvered Doors (slots) -->
          <rect x="10" y="16" width="20" height="42" fill="#E59866" stroke="#5D4037" stroke-width="1"/>
          <rect x="35" y="16" width="20" height="42" fill="#E59866" stroke="#5D4037" stroke-width="1"/>
          <!-- Louver lines -->
          <line x1="13" y1="25" x2="27" y2="25" stroke="#5D4037" stroke-width="1"/>
          <line x1="13" y1="35" x2="27" y2="35" stroke="#5D4037" stroke-width="1"/>
          <line x1="13" y1="45" x2="27" y2="45" stroke="#5D4037" stroke-width="1"/>
          <line x1="38" y1="25" x2="52" y2="25" stroke="#5D4037" stroke-width="1"/>
          <line x1="38" y1="35" x2="52" y2="35" stroke="#5D4037" stroke-width="1"/>
          <line x1="38" y1="45" x2="52" y2="45" stroke="#5D4037" stroke-width="1"/>
        `;
        break;

      case 'fur_kitchen_shelf':
        c = `
          <!-- Backboard -->
          <rect x="5" y="10" width="50" height="28" rx="1" fill="#FADBD8" stroke="#E6B0AA" stroke-width="1"/>
          <!-- Shelf board -->
          <rect x="2" y="28" width="56" height="5" fill="#CD853F" stroke="#8B5A2B" stroke-width="1"/>
          <!-- Hanging cups/jars -->
          <circle cx="15" cy="22" r="4" fill="#E74C3C"/>
          <rect x="13" y="15" width="4" height="4" fill="#E74C3C"/>
          <circle cx="30" cy="21" r="5" fill="#FFF" stroke="#BDC3C7" stroke-width="1"/>
          <ellipse cx="45" cy="20" rx="4" ry="6" fill="#3498DB"/>
        `;
        break;

      case 'fur_dining_table_small':
        c = `
          <!-- Table Top (Round edge) -->
          <ellipse cx="37.5" cy="18" rx="35" ry="9" fill="#D2B48C" stroke="#8B5A2B" stroke-width="2"/>
          <ellipse cx="37.5" cy="15" rx="35" ry="9" fill="#F5CBA7"/>
          <!-- Central Leg/Pedestal -->
          <rect x="34" y="23" width="7" height="30" fill="#8B5A2B"/>
          <!-- Base -->
          <path d="M22 53 L53 53 L48 57 L27 57 Z" fill="#8B5A2B"/>
        `;
        break;

      case 'fur_stool':
        c = `
          <!-- Seat -->
          <ellipse cx="17.5" cy="10" rx="15" ry="5" fill="#CD853F" stroke="#8B5A2B" stroke-width="1.5"/>
          <!-- Legs -->
          <line x1="7" y1="12" x2="4" y2="42" stroke="#8B5A2B" stroke-width="3" stroke-linecap="round"/>
          <line x1="28" y1="12" x2="31" y2="42" stroke="#8B5A2B" stroke-width="3" stroke-linecap="round"/>
          <line x1="17.5" y1="13" x2="17.5" y2="42" stroke="#5D4037" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Rungs -->
          <line x1="6" y1="28" x2="29" y2="28" stroke="#8B5A2B" stroke-width="1.5"/>
        `;
        break;

      case 'fur_water_dispenser':
        c = `
          <!-- Body -->
          <rect x="6" y="25" width="28" height="56" rx="2" fill="#FFF" stroke="#BDC3C7" stroke-width="1.5"/>
          <!-- Water tank bottle on top -->
          <path d="M10 25 C10 10, 30 10, 30 25 Z" fill="#AED6F1" stroke="#3498DB" stroke-width="1.5" opacity="0.8"/>
          <rect x="17" y="22" width="6" height="4" fill="#3498DB"/>
          <!-- Dispenser niche -->
          <rect x="11" y="38" width="18" height="20" rx="1" fill="#EAEDED" stroke="#D5DBDB" stroke-width="1"/>
          <!-- Taps -->
          <circle cx="16" cy="43" r="2.5" fill="#E74C3C"/> <!-- hot -->
          <circle cx="24" cy="43" r="2.5" fill="#3498DB"/> <!-- cold -->
        `;
        break;

      case 'fur_bathtub':
        c = `
          <!-- Tub main body -->
          <path d="M5 25 C5 25, 5 55, 30 55 C55 55, 95 55, 95 25 Z" fill="#FFF" stroke="#BDC3C7" stroke-width="2"/>
          <ellipse cx="50" cy="22" rx="45" ry="8" fill="#FFF" stroke="#BDC3C7" stroke-width="1.5"/>
          <ellipse cx="50" cy="24" rx="42" ry="6" fill="#EAEDED"/>
          <!-- Water -->
          <ellipse cx="50" cy="27" rx="38" ry="4" fill="#AED6F1" opacity="0.6"/>
          <!-- Faucet -->
          <path d="M8 20 Q5 10 12 10" fill="none" stroke="#BDC3C7" stroke-width="2.5"/>
          <!-- Feet -->
          <circle cx="20" cy="56" r="3.5" fill="#7F8C8D"/>
          <circle cx="80" cy="56" r="3.5" fill="#7F8C8D"/>
        `;
        break;

      case 'fur_sink':
        c = `
          <!-- Cabinet Base -->
          <rect x="5" y="25" width="45" height="46" fill="#FFF" stroke="#BDC3C7" stroke-width="2"/>
          <rect x="10" y="35" width="15" height="30" fill="#F2F3F4" stroke="#BDC3C7" stroke-width="1"/>
          <rect x="30" y="35" width="15" height="30" fill="#F2F3F4" stroke="#BDC3C7" stroke-width="1"/>
          <circle cx="22" cy="50" r="1.5" fill="#7F8C8D"/>
          <circle cx="32" cy="50" r="1.5" fill="#7F8C8D"/>
          <!-- Sink Bowl -->
          <rect x="2" y="16" width="51" height="10" rx="3" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
          <!-- Faucet -->
          <path d="M27 16 L27 8 L22 8" fill="none" stroke="#BDC3C7" stroke-width="2" stroke-linecap="round"/>
        `;
        break;

      case 'fur_toilet':
        c = `
          <!-- Tank -->
          <rect x="6" y="5" width="33" height="30" rx="3" fill="#FFF" stroke="#BDC3C7" stroke-width="2"/>
          <circle cx="12" cy="10" r="3" fill="#BDC3C7"/> <!-- Flush button -->
          <!-- Bowl base -->
          <path d="M12 35 C12 35, 12 65, 22 65 C32 65, 42 65, 42 35 Z" fill="#FFF" stroke="#BDC3C7" stroke-width="2"/>
          <!-- Seat -->
          <ellipse cx="27" cy="35" rx="13" ry="4" fill="#FFF" stroke="#BDC3C7" stroke-width="1"/>
        `;
        break;

      case 'fur_laundry_basket':
        c = `
          <!-- Basket body (weave pattern) -->
          <path d="M6 10 L39 10 L34 50 L11 50 Z" fill="#F5CBA7" stroke="#CD853F" stroke-width="2"/>
          <!-- Handles -->
          <circle cx="8" cy="18" r="3" fill="none" stroke="#CD853F" stroke-width="1.5"/>
          <circle cx="37" cy="18" r="3" fill="none" stroke="#CD853F" stroke-width="1.5"/>
          <!-- Clothes peeking out -->
          <path d="M12 10 Q22 2 32 10 Z" fill="#FF8AAE"/>
        `;
        break;

      case 'fur_towel_rack':
        c = `
          <!-- Stand legs -->
          <line x1="10" y1="10" x2="10" y2="65" stroke="#8B5A2B" stroke-width="3"/>
          <line x1="40" y1="10" x2="40" y2="65" stroke="#8B5A2B" stroke-width="3"/>
          <rect x="6" y="60" width="8" height="5" fill="#5D4037"/>
          <rect x="36" y="60" width="8" height="5" fill="#5D4037"/>
          <!-- Rails -->
          <line x1="10" y1="20" x2="40" y2="20" stroke="#CD853F" stroke-width="2"/>
          <line x1="10" y1="38" x2="40" y2="38" stroke="#CD853F" stroke-width="2"/>
          <!-- Towel hanging -->
          <rect x="15" y="20" width="20" height="28" fill="#5DADE2" rx="1"/>
          <line x1="15" y1="45" x2="35" y2="45" stroke="#2E86C1" stroke-width="1.5"/>
        `;
        break;

      case 'fur_pet_house':
        c = `
          <!-- Wall base -->
          <rect x="8" y="25" width="54" height="35" rx="2" fill="#F9E79F" stroke="#F4D03F" stroke-width="1.5"/>
          <!-- Roof -->
          <polygon points="4,25 35,5 66,25" fill="#E74C3C" stroke="#C0392B" stroke-width="2"/>
          <!-- Entrance Arch -->
          <path d="M23 60 C23 42, 47 42, 47 60 Z" fill="#5D4037"/>
          <circle cx="35" cy="16" r="3" fill="#FFF"/> <!-- sign hanging -->
        `;
        break;

      case 'fur_pet_feeder':
        c = `
          <!-- Back tank -->
          <rect x="12" y="4" width="21" height="20" rx="2" fill="#FFF" stroke="#BDC3C7" stroke-width="1.5"/>
          <rect x="15" y="8" width="15" height="12" fill="#AED6F1" opacity="0.6"/> <!-- food visible inside -->
          <!-- Bowl base -->
          <path d="M5 24 L40 24 L37 32 L8 32 Z" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="1"/>
          <!-- Food kibbles in bowl -->
          <circle cx="15" cy="27" r="1.5" fill="#CD853F"/>
          <circle cx="20" cy="28" r="1.5" fill="#CD853F"/>
          <circle cx="25" cy="27" r="1.5" fill="#CD853F"/>
        `;
        break;

      case 'fur_sofa_long':
        c = `
          <!-- Back support -->
          <rect x="5" y="10" width="130" height="35" rx="5" fill="#34495E" stroke="#2C3E50" stroke-width="2"/>
          <!-- Left Armrest -->
          <rect x="5" y="30" width="12" height="25" rx="3" fill="#2C3E50"/>
          <!-- Right Armrest -->
          <rect x="123" y="30" width="12" height="25" rx="3" fill="#2C3E50"/>
          <!-- Seat Cushion -->
          <rect x="15" y="35" width="110" height="22" rx="3" fill="#5DADE2" stroke="#2C3E50" stroke-width="1.5"/>
          <!-- Cushions divisions -->
          <line x1="51" y1="35" x2="51" y2="57" stroke="#2C3E50" stroke-width="1.5"/>
          <line x1="88" y1="35" x2="88" y2="57" stroke="#2C3E50" stroke-width="1.5"/>
          <!-- Legs -->
          <rect x="12" y="57" width="8" height="6" fill="#1A252F"/>
          <rect x="120" y="57" width="8" height="6" fill="#1A252F"/>
          <rect x="66" y="57" width="8" height="6" fill="#1A252F"/>
        `;
        break;

      case 'fur_desk_lamp':
        c = `
          <!-- Base -->
          <ellipse cx="15" cy="40" rx="8" ry="3" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="1"/>
          <!-- Arm -->
          <path d="M15 38 Q25 22 17 18" fill="none" stroke="#95A5A6" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Head shade -->
          <path d="M12 18 L25 10 L28 16 L15 24 Z" fill="#E74C3C" stroke="#C0392B" stroke-width="1.5"/>
          <!-- Light cone glow -->
          <polygon points="16,22 8,42 22,42" fill="#FFF59D" opacity="0.3"/>
        `;
        break;

      case 'fur_coat_hanger':
        c = `
          <!-- Base stand -->
          <ellipse cx="20" cy="88" rx="12" ry="4" fill="#5D4037" stroke="#3E2723" stroke-width="2"/>
          <!-- Main pole -->
          <rect x="18" y="10" width="4" height="76" fill="#5D4037"/>
          <!-- Pegs on top -->
          <line x1="18" y1="20" x2="10" y2="15" stroke="#3E2723" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="22" y1="20" x2="30" y2="15" stroke="#3E2723" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="18" y1="35" x2="12" y2="30" stroke="#3E2723" stroke-width="2" stroke-linecap="round"/>
          <line x1="22" y1="35" x2="28" y2="30" stroke="#3E2723" stroke-width="2" stroke-linecap="round"/>
          <!-- Hat hanging on top peg -->
          <path d="M6 16 C6 10, 14 10, 14 16 Z" fill="#F4D03F" opacity="0.9"/>
          <ellipse cx="10" cy="16" rx="5" ry="1.5" fill="#F4D03F" opacity="0.9"/>
        `;
        break;

      case 'dec_rug_welcome':
        c = `
          <!-- Outer border -->
          <rect x="3" y="3" width="59" height="19" rx="2" fill="#7E51A9" stroke="#683993" stroke-width="1.5"/>
          <!-- Inner mat -->
          <rect x="7" y="5" width="51" height="15" fill="#E8DDF2"/>
          <!-- Text -->
          <text x="32" y="16" font-size="7" font-weight="900" fill="#683993" text-anchor="middle" font-family="monospace" letter-spacing="1">WELCOME</text>
        `;
        break;

      case 'dec_mirror_wall':
        c = `
          <!-- Hanging strap -->
          <line x1="22" y1="5" x2="10" y2="30" stroke="#795548" stroke-width="1.5"/>
          <line x1="22" y1="5" x2="35" y2="30" stroke="#795548" stroke-width="1.5"/>
          <circle cx="22" cy="5" r="2" fill="#5D4037"/>
          <!-- Frame -->
          <circle cx="22" cy="32" r="18" fill="#CD853F" stroke="#8B5A2B" stroke-width="2"/>
          <!-- Mirror surface -->
          <circle cx="22" cy="32" r="15" fill="#AED6F1"/>
          <!-- Reflection shine -->
          <path d="M12 28 Q22 15 32 22" stroke="#FFF" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round"/>
        `;
        break;

      case 'dec_plant_hanging':
        c = `
          <!-- Hanging rope -->
          <line x1="17" y1="2" x2="17" y2="28" stroke="#D35400" stroke-width="1"/>
          <!-- Pot -->
          <path d="M10 28 L24 28 L21 38 L13 38 Z" fill="#D35400"/>
          <!-- Hanging vines -->
          <path d="M12 30 Q8 45 14 58" stroke="#27AE60" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M17 32 Q22 45 15 54" stroke="#2ECC71" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M22 30 Q28 42 20 50" stroke="#27AE60" stroke-width="2" fill="none" stroke-linecap="round"/>
          <!-- Leaves details -->
          <circle cx="10" cy="36" r="2.5" fill="#2ECC71"/>
          <circle cx="24" cy="38" r="2.5" fill="#27AE60"/>
          <circle cx="11" cy="46" r="2" fill="#2ECC71"/>
          <circle cx="19" cy="48" r="2.2" fill="#27AE60"/>
        `;
        break;

      case 'dec_calendar':
        c = `
          <!-- Board base -->
          <rect x="3" y="3" width="24" height="34" rx="1" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1.5"/>
          <!-- Top bar -->
          <rect x="3" y="3" width="24" height="8" rx="1" fill="#E74C3C"/>
          <!-- Grid lines -->
          <line x1="6" y1="18" x2="24" y2="18" stroke="#BDC3C7" stroke-width="1"/>
          <line x1="6" y1="24" x2="24" y2="24" stroke="#BDC3C7" stroke-width="1"/>
          <line x1="6" y1="30" x2="24" y2="30" stroke="#BDC3C7" stroke-width="1"/>
          <!-- Red target date circle and date text -->
          <text x="15" y="27" font-size="9" font-weight="bold" fill="#E74C3C" text-anchor="middle">13</text>
        `;
        break;

      case 'dec_tissue_box':
        c = `
          <!-- Box body -->
          <rect x="2" y="10" width="26" height="13" rx="2" fill="#5DADE2" stroke="#2980B9" stroke-width="1"/>
          <!-- Opening slot -->
          <ellipse cx="15" cy="10" rx="6" ry="2" fill="#2980B9"/>
          <!-- Tissue standing out -->
          <path d="M12 10 Q15 2 17 8 Q17 10 12 10 Z" fill="#FFF" stroke="#E5E7E9" stroke-width="0.5"/>
        `;
        break;

      case 'dec_rug_star':
        c = `
          <!-- Star shape -->
          <polygon points="30,2 38,18 56,20 42,32 46,50 30,40 14,50 18,32 4,20 22,18" fill="#F4D03F" stroke="#F1C40F" stroke-width="1.5"/>
          <polygon points="30,6 36,19 51,21 39,30 43,45 30,37 17,45 21,30 9,21 24,19" fill="#FFF59D"/>
        `;
        break;

      case 'dec_painting_sunset':
        c = `
          <!-- Frame -->
          <rect x="2" y="2" width="66" height="46" rx="2" fill="#5D4037" stroke="#3E2723" stroke-width="2"/>
          <!-- Sunset canvas -->
          <rect x="6" y="6" width="58" height="38" fill="#F5B041"/>
          <!-- Sun and mountains -->
          <circle cx="35" cy="28" r="10" fill="#E74C3C"/>
          <polygon points="6,44 25,32 45,44" fill="#E67E22"/>
          <polygon points="30,44 50,30 64,44" fill="#D35400"/>
        `;
        break;

      case 'dec_cushion_cat':
        c = `
          <!-- Cushion round base -->
          <circle cx="17.5" cy="17.5" r="15" fill="#F9E79F" stroke="#F4D03F" stroke-width="1.5"/>
          <!-- Cat ears -->
          <polygon points="6,7 12,3 13,10" fill="#F9E79F" stroke="#F4D03F" stroke-width="1.5"/>
          <polygon points="29,7 23,3 22,10" fill="#F9E79F" stroke="#F4D03F" stroke-width="1.5"/>
          <!-- Eyes and blush -->
          <circle cx="12" cy="16" r="1.5" fill="#2C3E50"/>
          <circle cx="23" cy="16" r="1.5" fill="#2C3E50"/>
          <circle cx="9" cy="19" r="2" fill="#FF8AAE" opacity="0.6"/>
          <circle cx="26" cy="19" r="2" fill="#FF8AAE" opacity="0.6"/>
          <!-- Smile -->
          <path d="M15 20 Q17.5 22 20 20" fill="none" stroke="#2C3E50" stroke-width="1" stroke-linecap="round"/>
        `;
        break;

      case 'dec_plant_monstera':
        c = `
          <!-- Clay Pot -->
          <polygon points="15,48 35,48 32,68 18,68" fill="#D35400" stroke="#BA4A00" stroke-width="1.5"/>
          <rect x="13" y="44" width="24" height="4" fill="#E67E22"/>
          <!-- Monstera Leaves (large green shapes with slits) -->
          <path d="M25 44 C20 30, 8 32, 12 18 C15 5, 35 12, 25 44 Z" fill="#27AE60"/>
          <path d="M25 44 C30 30, 42 32, 38 18 C35 5, 15 12, 25 44 Z" fill="#2ECC71"/>
          <!-- Leaf Cuts -->
          <path d="M10 24 L20 28" stroke="#FFF" stroke-width="1.5" opacity="0.3"/>
          <path d="M40 24 L30 28" stroke="#FFF" stroke-width="1.5" opacity="0.3"/>
        `;
        break;

      case 'dec_books_pile':
        c = `
          <!-- Book 1 (bottom) -->
          <rect x="2" y="18" width="36" height="10" rx="1" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>
          <rect x="34" y="19" width="3" height="8" fill="#F2F3F4"/>
          <!-- Book 2 (middle) -->
          <rect x="5" y="10" width="31" height="9" rx="1" fill="#3498DB" stroke="#2980B9" stroke-width="1"/>
          <rect x="32" y="11" width="3" height="7" fill="#F2F3F4"/>
          <!-- Book 3 (top) -->
          <rect x="8" y="3" width="25" height="8" rx="1" fill="#F1C40F" stroke="#F39C12" stroke-width="1"/>
          <rect x="29" y="4" width="3" height="6" fill="#F2F3F4"/>
        `;
        break;

      case 'dec_cup_hot_chocolate':
        c = `
          <!-- Mug handle -->
          <path d="M20 12 C24 12, 24 20, 20 20" fill="none" stroke="#E74C3C" stroke-width="2"/>
          <!-- Mug body -->
          <rect x="5" y="8" width="16" height="15" rx="2" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>
          <!-- Hot drink surface -->
          <ellipse cx="13" cy="8" rx="7" ry="2" fill="#5D4037"/>
          <!-- Steam lines -->
          <path d="M10 5 Q12 1 11 0" fill="none" stroke="#BDC3C7" stroke-width="1" stroke-linecap="round"/>
          <path d="M15 5 Q17 1 16 0" fill="none" stroke="#BDC3C7" stroke-width="1" stroke-linecap="round"/>
        `;
        break;

      case 'dec_tissue_roll':
        c = `
          <!-- Roll side -->
          <rect x="2" y="5" width="13" height="15" rx="1" fill="#FFF" stroke="#BDC3C7" stroke-width="1"/>
          <ellipse cx="8.5" cy="5" rx="6.5" ry="2.5" fill="#EAEDED" stroke="#BDC3C7" stroke-width="1"/>
          <ellipse cx="8.5" cy="5" rx="2.5" ry="1" fill="#7F8C8D"/>
          <!-- Loose tail hanging -->
          <path d="M15 12 L18 23" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
        `;
        break;

      case 'dec_wall_clock_modern':
        c = `
          <!-- Clock Outer rim -->
          <circle cx="20" cy="20" r="18" fill="#34495E" stroke="#2C3E50" stroke-width="2"/>
          <circle cx="20" cy="20" r="15" fill="#FFF"/>
          <!-- Hour markers -->
          <line x1="20" y1="7" x2="20" y2="9" stroke="#333" stroke-width="1.5"/>
          <line x1="20" y1="31" x2="20" y2="33" stroke="#333" stroke-width="1.5"/>
          <line x1="7" y1="20" x2="9" y2="20" stroke="#333" stroke-width="1.5"/>
          <line x1="31" y1="20" x2="33" y2="20" stroke="#333" stroke-width="1.5"/>
          <!-- Hands -->
          <line x1="20" y1="20" x2="20" y2="12" stroke="#E74C3C" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="20" y1="20" x2="26" y2="20" stroke="#333" stroke-width="2" stroke-linecap="round"/>
          <circle cx="20" cy="20" r="2" fill="#E74C3C"/>
        `;
        break;

      case 'dec_rug_heart':
        c = `
          <!-- Heart shape -->
          <path d="M30 12 C18 0, 5 15, 30 42 C55 15, 42 0, 30 12 Z" fill="#FF8AAE" stroke="#FF69B4" stroke-width="1.5"/>
          <path d="M30 16 C22 5, 10 18, 30 38 C50 18, 38 5, 30 16 Z" fill="#FFB6C1"/>
        `;
        break;

      case 'dec_painting_cat':
        c = `
          <!-- Frame -->
          <rect x="2" y="2" width="50" height="41" rx="2" fill="#F5B041" stroke="#D35400" stroke-width="1.5"/>
          <!-- Canvas -->
          <rect x="5" y="5" width="40" height="35" fill="#EAEDED"/>
          <!-- Cat drawing -->
          <circle cx="25" cy="25" r="10" fill="#FF8C42"/>
          <polygon points="17,17 17,9 23,15" fill="#FF8C42"/>
          <polygon points="33,17 33,9 27,15" fill="#FF8C42"/>
          <circle cx="21" cy="23" r="1.5" fill="#2C3E50"/>
          <circle cx="29" cy="23" r="1.5" fill="#2C3E50"/>
          <path d="M23 27 Q25 29 27 27" fill="none" stroke="#2C3E50" stroke-width="1"/>
        `;
        break;

      case 'dec_slipper_rack':
        c = `
          <!-- Wooden rack -->
          <rect x="5" y="15" width="45" height="15" fill="#D2B48C" stroke="#8B5A2B" stroke-width="1.5"/>
          <rect x="10" y="5" width="4" height="28" fill="#8B5A2B"/>
          <rect x="41" y="5" width="4" height="28" fill="#8B5A2B"/>
          <!-- Slippers -->
          <rect x="16" y="10" width="8" height="6" rx="2" fill="#FF6B6B"/>
          <rect x="30" y="10" width="8" height="6" rx="2" fill="#4ECDC4"/>
        `;
        break;

      case 'dec_snowglobe':
        c = `
          <!-- Wooden Base -->
          <rect x="4" y="27" width="22" height="6" rx="1" fill="#8B5A2B" stroke="#5D4037" stroke-width="1"/>
          <!-- Glass Globe -->
          <circle cx="15" cy="16" r="12" fill="#E8F8F5" stroke="#BDC3C7" stroke-width="1" opacity="0.9"/>
          <!-- Snowman inside -->
          <circle cx="15" cy="21" r="4" fill="#FFF"/>
          <circle cx="15" cy="15" r="2.5" fill="#FFF"/>
          <rect x="13" y="12" width="4" height="1.5" fill="#E74C3C"/>
          <!-- Sparkles -->
          <circle cx="9" cy="11" r="0.8" fill="#FFF"/>
          <circle cx="21" cy="18" r="0.8" fill="#FFF"/>
        `;
        break;

      case 'dec_alarm_clock':
        c = `
          <!-- Feet -->
          <line x1="8" y1="24" x2="4" y2="28" stroke="#333" stroke-width="2"/>
          <line x1="22" y1="24" x2="26" y2="28" stroke="#333" stroke-width="2"/>
          <!-- Bells -->
          <circle cx="8" cy="6" r="4" fill="#E74C3C" stroke="#333" stroke-width="1"/>
          <circle cx="22" cy="6" r="4" fill="#E74C3C" stroke="#333" stroke-width="1"/>
          <path d="M12 4 Q15 2 18 4" fill="none" stroke="#333" stroke-width="1.5"/>
          <!-- Main Body -->
          <circle cx="15" cy="16" r="10" fill="#E74C3C" stroke="#333" stroke-width="1.5"/>
          <circle cx="15" cy="16" r="8" fill="#FFF"/>
          <!-- Hands -->
          <line x1="15" y1="16" x2="15" y2="11" stroke="#333" stroke-width="1.5"/>
          <line x1="15" y1="16" x2="19" y2="18" stroke="#333" stroke-width="1"/>
        `;
        break;

      case 'dec_plant_cactus_tall':
        c = `
          <!-- Pot -->
          <rect x="10" y="45" width="15" height="18" rx="1" fill="#D35400" stroke="#BA4A00" stroke-width="1.5"/>
          <!-- Cactus stem -->
          <rect x="14" y="10" width="7" height="36" rx="3.5" fill="#27AE60"/>
          <!-- Branches -->
          <path d="M14 24 L8 24 L8 15" fill="none" stroke="#27AE60" stroke-width="4" stroke-linecap="round"/>
          <path d="M21 28 L27 28 L27 18" fill="none" stroke="#2ECC71" stroke-width="4" stroke-linecap="round"/>
          <!-- Little pink flower on top -->
          <circle cx="17.5" cy="9" r="2" fill="#E91E63"/>
        `;
        break;

      case 'dec_board_game':
        c = `
          <!-- Game box -->
          <rect x="4" y="4" width="37" height="17" rx="1" fill="#45B7D1" stroke="#2980B9" stroke-width="1.5"/>
          <!-- Logo label -->
          <rect x="8" y="8" width="29" height="9" fill="#FFF" stroke="#E74C3C" stroke-width="0.5"/>
          <text x="22.5" y="15" font-size="6" fill="#E74C3C" font-weight="900" text-anchor="middle">BOARD</text>
        `;
        break;

      case 'dec_lava_lamp':
        c = `
          <!-- Base & Cap -->
          <path d="M4 52 L21 52 L17 60 L8 60 Z" fill="#BDC3C7" stroke="#7F8C8D" stroke-width="1"/>
          <polygon points="10,0 15,0 17,8 8,8" fill="#BDC3C7"/>
          <!-- Glass tube -->
          <rect x="7" y="8" width="11" height="44" fill="#F4D03F" stroke="#BDC3C7" stroke-width="1" opacity="0.9"/>
          <!-- Lava blobs inside -->
          <ellipse cx="12.5" cy="42" rx="4" ry="6" fill="#E74C3C"/>
          <circle cx="11" cy="22" r="2.5" fill="#E74C3C"/>
          <circle cx="14" cy="14" r="1.8" fill="#E74C3C"/>
        `;
        break;

      case 'dec_calendar_cat':
        c = `
          <!-- Triangle base stand -->
          <polygon points="3,27 27,27 24,29 6,29" fill="#7F8C8D"/>
          <!-- Cardboard pages -->
          <rect x="5" y="5" width="20" height="22" rx="1" fill="#FFF" stroke="#BDC3C7" stroke-width="1"/>
          <!-- Header cat ears -->
          <polygon points="7,5 9,1 11,5" fill="#FF8C42"/>
          <polygon points="19,5 21,1 23,5" fill="#FF8C42"/>
          <rect x="5" y="5" width="20" height="4" fill="#FF8C42"/>
          <!-- Grid mockup -->
          <line x1="8" y1="14" x2="22" y2="14" stroke="#D5DBDB" stroke-width="1"/>
          <line x1="8" y1="19" x2="22" y2="19" stroke="#D5DBDB" stroke-width="1"/>
          <circle cx="15" cy="19" r="1.5" fill="#E74C3C"/>
        `;
        break;

      case 'dec_plate_fruits':
        c = `
          <!-- Plate base -->
          <ellipse cx="20" cy="18" rx="18" ry="5" fill="#FFF" stroke="#BDC3C7" stroke-width="1.5"/>
          <!-- Fruits -->
          <circle cx="14" cy="14" r="4" fill="#E74C3C"/>
          <path d="M14 10 L16 8" stroke="#5D4037" stroke-width="1"/>
          <circle cx="21" cy="15" r="3.5" fill="#F4D03F"/>
          <circle cx="26" cy="13" r="3.8" fill="#FF8C42"/>
        `;
        break;

      case 'dec_diffuser':
        c = `
          <!-- Ceramic pot -->
          <path d="M6 35 C6 20, 24 20, 24 35 Z" fill="#FFF" stroke="#D5DBDB" stroke-width="1.5"/>
          <rect x="4" y="32" width="22" height="6" fill="#D2B48C" rx="1"/>
          <!-- Mist blowing on top -->
          <path d="M15 16 Q18 4 12 0" fill="none" stroke="#AED6F1" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
          <path d="M13 14 Q10 8 15 2" fill="none" stroke="#AED6F1" stroke-width="1" opacity="0.6" stroke-linecap="round"/>
        `;
        break;

      case 'dec_wall_stickers':
        c = `
          <!-- Scattered stars -->
          <polygon points="12,2 14,8 20,8 15,12 17,18 12,14 7,18 9,12 4,8 10,8" fill="#FFF59D" opacity="0.8"/>
          <polygon points="42,12 43,16 47,16 44,18 45,22 42,20 39,22 40,18 37,16 41,16" fill="#FFF59D" opacity="0.8"/>
          <polygon points="65,4 66,7 69,7 67,9 68,12 65,10 62,12 63,9 61,7 64,7" fill="#FFF59D" opacity="0.8"/>
        `;
        break;

      default:
        // Fallback simple chest
        c = `<rect x="10" y="20" width="80" height="60" rx="5" fill="#D2B48C" stroke="#8B5A2B" stroke-width="3"/>
             <line x1="10" y1="45" x2="90" y2="45" stroke="#8B5A2B" stroke-width="3"/>
             <rect x="45" y="40" width="10" height="10" fill="#FFD700"/>`;
    }

    return `<svg viewBox="0 0 ${dims.w} ${dims.h}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible;">${c}</svg>`;
  },

  // Render a detailed preview of any shop item (pet, food, furniture, clothes, accessory)
  renderItemPreview(item, gender = 'male', styleId = 'boy_1', size = 60) {
    if (!item) return '';
    
    // 1. Pets (dogs, cats)
    if (item.type === 'dog' || item.type === 'cat') {
      return this.renderPet(item, size, false);
    }
    
    // 2. Food
    if (item.id.startsWith('food_')) {
      return item.icon || item.emoji || '🥣';
    }
    
    // 3. Furniture and Decor
    if (item.id.startsWith('fur_') || item.id.startsWith('dec_')) {
      return this.renderFurnitureSVG(item.id, "100%", "100%");
    }
    
    // 4. Clothes and Accessories
    let previewGender = gender;
    let previewStyleId = styleId;
    if (item.gender === 'male') {
      previewGender = 'male';
      previewStyleId = 'boy_1';
    } else if (item.gender === 'female') {
      previewGender = 'female';
      previewStyleId = 'girl_1';
    }

    const outfit = {};
    const slot = item.slot;
    if (slot) {
      outfit[slot] = item.id;
    }
    
    // Strip other styles for focus
    if (slot !== 'top') {
      outfit.top = 'top_tshirt_white';
    }
    if (slot !== 'bottom') {
      outfit.bottom = 'bot_jeans_blue';
    }
    if (slot !== 'shoes') {
      outfit.shoes = 'shoe_sneakers_red';
    }
    
    return this.renderCharacter(previewGender, previewStyleId, outfit, size, false);
  },

  // Render shop items grid
  renderShopGrid(shopId, ownedIds = [], points = 0) {
    const shop = GAME_DATA.shops[shopId];
    if (!shop) return '';
    return shop.items.map(item => {
      const owned = ownedIds.includes(item.id);
      const canAfford = points >= item.price;
      
      let iconHtml = '';
      if (shopId === 'furniture' || shopId === 'decor') {
        iconHtml = `<div style="width:80px; height:80px; display:flex; align-items:center; justify-content:center; margin:0 auto;">${this.renderItemPreview(item, 'male', 'boy_1', 80)}</div>`;
      } else if (shopId === 'clothes' || shopId === 'accessories') {
        iconHtml = `<div style="width:80px; height:80px; display:flex; align-items:center; justify-content:center; margin:0 auto; overflow:visible;">${this.renderItemPreview(item, 'male', 'boy_1', 60)}</div>`;
      } else {
        iconHtml = this.renderItemPreview(item, 'male', 'boy_1', 80);
      }
      
      return `
      <div class="shop-item ${owned ? 'owned' : ''} ${!canAfford ? 'cant-afford' : ''}" 
           data-item-id="${item.id}" data-shop-id="${shopId}"
           onclick="SHOP.buyItem('${shopId}', '${item.id}')">
        <div class="shop-item-icon">${iconHtml}</div>
        <div class="shop-item-name">${item.nameVi}</div>
        <div class="shop-item-price ${!canAfford ? 'cant-afford-price' : ''}">
          <span class="coin-icon">⭐</span> ${item.price}
        </div>
        ${owned ? '<div class="owned-badge">Có rồi</div>' : ''}
      </div>`;
    }).join('');
  }

};

// Auto-decay pet stats over time
const PET_DECAY = {
  DECAY_RATE: 2, // per minute
  INTERVAL: 60000, // 1 minute

  startDecay() {
    setInterval(() => this.decay(), this.INTERVAL);
  },

  decay() {
    const student = AUTH.getCurrentStudent();
    if (!student || !student.pets) return;
    
    const now = Date.now();
    const pets = student.pets.map(pet => {
      const elapsed = (now - (pet.lastUpdate || now)) / 60000; // minutes
      const decay = this.DECAY_RATE * elapsed;
      return {
        ...pet,
        stats: {
          hunger: Math.max(0, (pet.stats?.hunger || 100) - decay),
          happiness: Math.max(0, (pet.stats?.happiness || 100) - decay * 0.8),
          cleanliness: Math.max(0, (pet.stats?.cleanliness || 100) - decay * 0.5),
          energy: Math.max(0, (pet.stats?.energy || 100) - decay * 0.6),
        },
        lastUpdate: now
      };
    });
    
    DB.updateStudent(student.id, { pets });
    
    // Refresh display if on student page
    if (typeof refreshPetDisplay === 'function') refreshPetDisplay();
  }
};
