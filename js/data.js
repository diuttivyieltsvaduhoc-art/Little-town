// =============================================
// LITTLE TOWN - DATA.JS
// All game data: items, shops, pets, characters
// =============================================

const GAME_DATA = {
  pets: {
    dogs: [
      { id: 'dog_labrador', name: 'Labrador', nameVi: 'Chó Labrador', emoji: '🐕', color: '#C8A97A', price: 800, type: 'dog' },
      { id: 'dog_corgi', name: 'Corgi', nameVi: 'Chó Corgi', emoji: '🐕', color: '#E8A85A', price: 700, type: 'dog' },
      { id: 'dog_poodle', name: 'Poodle', nameVi: 'Chó Poodle', emoji: '🐩', color: '#F0E0E0', price: 900, type: 'dog' },
      { id: 'dog_shiba', name: 'Shiba Inu', nameVi: 'Chó Shiba', emoji: '🐕', color: '#D4784A', price: 1000, type: 'dog' },
      { id: 'dog_husky', name: 'Husky', nameVi: 'Chó Husky', emoji: '🐕', color: '#708090', price: 1200, type: 'dog' },
    ],
    cats: [
      { id: 'cat_orange', name: 'Orange Cat', nameVi: 'Mèo Cam Dễ Thương', emoji: '🐈', color: '#E05A47', price: 600, type: 'cat' },
      { id: 'cat_black', name: 'Black Cat', nameVi: 'Mèo Đen', emoji: '🐈‍⬛', color: '#2C2C2C', price: 650, type: 'cat' },
      { id: 'cat_british', name: 'British Shorthair', nameVi: 'Mèo Anh Lông Ngắn', emoji: '🐈', color: '#9B8EA1', price: 1100, type: 'cat' },
      { id: 'cat_maine', name: 'Maine Coon', nameVi: 'Mèo Maine Coon', emoji: '🐈', color: '#A0522D', price: 1300, type: 'cat' },
      { id: 'cat_siamese', name: 'Siamese', nameVi: 'Mèo Xiêm', emoji: '🐈', color: '#F5DEB3', price: 950, type: 'cat' },
    ]
  },

  shops: {
    pets: {
      id: 'shop_pets',
      name: 'Pet Shop',
      nameVi: 'Cửa Hàng Thú Cưng',
      icon: '🐾',
      color: '#FF6584',
      items: [] // populated from pets above
    },
    food: {
      id: 'shop_food',
      name: 'Pet Food',
      nameVi: 'Đồ Ăn Thú Cưng',
      icon: '🍖',
      color: '#F7971E',
      items: [
        { id: 'food_kibble', name: 'Dry Kibble', nameVi: 'Thức Ăn Hạt', icon: '🥣', price: 50, effect: { hunger: 30 }, desc: 'Thức ăn khô dinh dưỡng' },
        { id: 'food_bone', name: 'Bone Broth', nameVi: 'Xương Hầm', icon: '🦴', price: 80, effect: { hunger: 50, happiness: 20 }, desc: 'Xương hầm thơm ngon' },
        { id: 'food_fish', name: 'Fresh Fish', nameVi: 'Cá Tươi', icon: '🐟', price: 90, effect: { hunger: 45, happiness: 15 }, desc: 'Cá tươi giàu omega-3' },
        { id: 'food_treat', name: 'Cookie Treat', nameVi: 'Bánh Thưởng', icon: '🍪', price: 60, effect: { happiness: 40 }, desc: 'Bánh thưởng cho thú cưng vui vẻ' },
        { id: 'food_water', name: 'Fresh Water', nameVi: 'Nước Sạch', icon: '💧', price: 30, effect: { hunger: 15, cleanliness: 10 }, desc: 'Nước sạch mát lạnh' },
        { id: 'food_meat', name: 'Premium Meat', nameVi: 'Thịt Thượng Hạng', icon: '🥩', price: 150, effect: { hunger: 80, happiness: 30 }, desc: 'Thịt cao cấp bổ dưỡng' },
        { id: 'food_milk', name: 'Cat Milk', nameVi: 'Sữa Thú Cưng', icon: '🥛', price: 70, effect: { hunger: 35, energy: 25 }, desc: 'Sữa chuyên dụng cho thú cưng' },
        { id: 'food_veggie', name: 'Veggie Mix', nameVi: 'Rau Củ Quả', icon: '🥗', price: 55, effect: { hunger: 25, energy: 20 }, desc: 'Hỗn hợp rau củ tươi' },
        { id: 'food_cake', name: 'Birthday Cake', nameVi: 'Bánh Sinh Nhật', icon: '🎂', price: 200, effect: { hunger: 60, happiness: 60 }, desc: 'Bánh đặc biệt cho ngày vui' },
        { id: 'food_candy', name: 'Sweet Candy', nameVi: 'Kẹo Ngọt', icon: '🍬', price: 45, effect: { happiness: 30 }, desc: 'Kẹo ngọt khiến thú vui vẻ' },
        { id: 'food_soup', name: 'Warm Soup', nameVi: 'Súp Ấm', icon: '🍲', price: 110, effect: { hunger: 55, energy: 30 }, desc: 'Súp ấm bổ dưỡng' },
        { id: 'food_snack', name: 'Crunchy Snack', nameVi: 'Snack Giòn', icon: '🧇', price: 65, effect: { hunger: 30, happiness: 20 }, desc: 'Snack giòn rụm hấp dẫn' },
        { id: 'food_juice', name: 'Fruit Juice', nameVi: 'Nước Ép Trái Cây', icon: '🧃', price: 75, effect: { hunger: 20, energy: 40 }, desc: 'Nước ép trái cây tươi mát' },
        { id: 'food_sashimi', name: 'Sashimi', nameVi: 'Sashimi Cá Hồi', icon: '🍣', price: 180, effect: { hunger: 70, happiness: 40 }, desc: 'Sashimi cá hồi cao cấp' },
        { id: 'food_bowl', name: 'Full Meal Bowl', nameVi: 'Bát Cơm Đầy', icon: '🍱', price: 130, effect: { hunger: 90, energy: 20 }, desc: 'Bữa ăn đầy đủ dinh dưỡng' },
      ]
    },
    clothes: {
      id: 'shop_clothes',
      name: 'Clothing Store',
      nameVi: 'Cửa Hàng Quần Áo',
      icon: '👗',
      color: '#6C63FF',
      items: [
        // Tops (40 items)
        { id: 'top_tshirt_white', name: 'White T-Shirt', nameVi: 'Áo Phông Trắng', icon: '👕', price: 100, slot: 'top', style: 'casual', color: '#FFFFFF' },
        { id: 'top_tshirt_blue', name: 'Blue T-Shirt', nameVi: 'Áo Phông Xanh', icon: '👕', price: 100, slot: 'top', style: 'casual', color: '#4A90D9' },
        { id: 'top_hoodie_grey', name: 'Grey Hoodie', nameVi: 'Áo Hoodie Xám', icon: '🧥', price: 200, slot: 'top', style: 'casual', color: '#9B9B9B' },
        { id: 'top_hoodie_pink', name: 'Pink Hoodie', nameVi: 'Áo Hoodie Hồng', icon: '🧥', price: 200, slot: 'top', style: 'casual', color: '#FFB6C1' },
        { id: 'top_shirt_school', name: 'School Shirt', nameVi: 'Áo Đồng Phục', icon: '👔', price: 150, slot: 'top', style: 'school', color: '#FFFFFF' },
        { id: 'top_blazer_navy', name: 'Navy Blazer', nameVi: 'Áo Blazer Navy', icon: '🧥', price: 350, slot: 'top', style: 'formal', color: '#1F3A6E' },
        { id: 'top_sport_red', name: 'Sport Jersey Red', nameVi: 'Áo Thể Thao Đỏ', icon: '👕', price: 180, slot: 'top', style: 'sport', color: '#E74C3C' },
        { id: 'top_sport_green', name: 'Sport Jersey Green', nameVi: 'Áo Thể Thao Xanh', icon: '👕', price: 180, slot: 'top', style: 'sport', color: '#2ECC71' },
        { id: 'top_dress_summer', name: 'Summer Dress', nameVi: 'Váy Mùa Hè', icon: '👗', price: 280, slot: 'top', style: 'casual', color: '#FFF176' },
        { id: 'top_dress_floral', name: 'Floral Dress', nameVi: 'Váy Hoa', icon: '👗', price: 320, slot: 'top', style: 'casual', color: '#FF8AAE' },
        { id: 'top_sweater_xmas', name: 'Xmas Sweater', nameVi: 'Áo Len Giáng Sinh', icon: '👕', price: 250, slot: 'top', style: 'seasonal', color: '#C0392B' },
        { id: 'top_kimono', name: 'Kimono', nameVi: 'Áo Kimono', icon: '👘', price: 450, slot: 'top', style: 'fantasy', color: '#8E44AD' },
        { id: 'top_jacket_leather', name: 'Leather Jacket', nameVi: 'Áo Khoác Da', icon: '🧥', price: 400, slot: 'top', style: 'casual', color: '#2C2C2C' },
        { id: 'top_polo_stripe', name: 'Striped Polo', nameVi: 'Áo Polo Kẻ Sọc', icon: '👕', price: 160, slot: 'top', style: 'casual', color: '#3498DB' },
        { id: 'top_cardigan', name: 'Cozy Cardigan', nameVi: 'Áo Cardigan Ấm', icon: '🧥', price: 220, slot: 'top', style: 'casual', color: '#DEB887' },
        { id: 'top_tanktop_white', name: 'White Tank Top', nameVi: 'Áo Thun Ba Lỗ', icon: '👕', price: 80, slot: 'top', style: 'sport', color: '#F8F8F8' },
        { id: 'top_armor', name: 'Fantasy Armor', nameVi: 'Giáp Phép Thuật', icon: '🦺', price: 500, slot: 'top', style: 'fantasy', color: '#FFD700' },
        { id: 'top_cape', name: 'Magic Cape', nameVi: 'Áo Choàng Phép', icon: '🧥', price: 480, slot: 'top', style: 'fantasy', color: '#6A0DAD' },
        { id: 'top_yukata', name: 'Yukata', nameVi: 'Yukata Nhật Bản', icon: '👘', price: 380, slot: 'top', style: 'fantasy', color: '#2980B9' },
        { id: 'top_raincoat', name: 'Raincoat', nameVi: 'Áo Mưa Dễ Thương', icon: '🧥', price: 200, slot: 'top', style: 'seasonal', color: '#F39C12' },
        { id: 'top_shirt_denim', name: 'Denim Shirt', nameVi: 'Áo Sơ Mi Denim', icon: '👕', price: 180, slot: 'top', style: 'casual', color: '#2E86C1' },
        { id: 'top_sweater_yellow', name: 'Yellow Sweater', nameVi: 'Áo Len Vàng', icon: '👕', price: 220, slot: 'top', style: 'casual', color: '#F4D03F' },
        { id: 'top_vest_formal', name: 'Formal Vest', nameVi: 'Áo Vest Lịch Lãm', icon: '👔', price: 450, slot: 'top', style: 'formal', color: '#2C3E50' },
        { id: 'top_dress_princess', name: 'Princess Gown', nameVi: 'Đầm Công Chúa', icon: '👗', price: 600, slot: 'top', style: 'fantasy', color: '#F1948A' },
        { id: 'top_jersey_basketball', name: 'Basketball Jersey', nameVi: 'Áo Bóng Rổ', icon: '👕', price: 170, slot: 'top', style: 'sport', color: '#E67E22' },
        { id: 'top_jacket_down', name: 'Down Jacket', nameVi: 'Áo Phao Mùa Đông', icon: '🧥', price: 380, slot: 'top', style: 'seasonal', color: '#2980B9' },
        { id: 'top_tshirt_cat', name: 'Cat T-Shirt', nameVi: 'Áo In Hình Mèo', icon: '👕', price: 120, slot: 'top', style: 'casual', color: '#FADBD8' },
        { id: 'top_hoodie_ninja', name: 'Ninja Hoodie', nameVi: 'Áo Hoodie Ninja', icon: '🧥', price: 420, slot: 'top', style: 'fantasy', color: '#1A1A1A' },
        { id: 'top_blouse_lace', name: 'Lace Blouse', nameVi: 'Áo Kiểu Ren Trắng', icon: '👕', price: 260, slot: 'top', style: 'formal', color: '#FFF8DC' },
        { id: 'top_sweater_stripes', name: 'Striped Sweater', nameVi: 'Áo Len Kẻ Sọc', icon: '👕', price: 210, slot: 'top', style: 'casual', color: '#E74C3C' },
        { id: 'top_jacket_denim', name: 'Denim Jacket', nameVi: 'Áo Khoác Bò', icon: '🧥', price: 320, slot: 'top', style: 'casual', color: '#3498DB' },
        { id: 'top_tshirt_star', name: 'Star T-Shirt', nameVi: 'Áo Phông Ngôi Sao', icon: '👕', price: 110, slot: 'top', style: 'casual', color: '#FFFACD' },
        { id: 'top_tshirt_heart', name: 'Heart T-Shirt', nameVi: 'Áo Thun Trái Tim', icon: '👕', price: 110, slot: 'top', style: 'casual', color: '#FFB6C1' },
        { id: 'top_dress_party', name: 'Party Dress', nameVi: 'Váy Dạ Hội', icon: '👗', price: 520, slot: 'top', style: 'formal', color: '#8E44AD' },
        { id: 'top_dress_gothic', name: 'Gothic Dress', nameVi: 'Đầm Gothic', icon: '👗', price: 480, slot: 'top', style: 'fantasy', color: '#212121' },
        { id: 'top_jacket_bomber', name: 'Bomber Jacket', nameVi: 'Áo Khoác Bomber', icon: '🧥', price: 290, slot: 'top', style: 'sport', color: '#16A085' },
        { id: 'top_jersey_soccer', name: 'Soccer Jersey', nameVi: 'Áo Bóng Đá', icon: '👕', price: 170, slot: 'top', style: 'sport', color: '#27AE60' },
        { id: 'top_sweater_bear', name: 'Bear Sweater', nameVi: 'Áo Len Gấu Trúc', icon: '👕', price: 240, slot: 'top', style: 'casual', color: '#F5F5DC' },
        { id: 'top_vest_light', name: 'Light Office Vest', nameVi: 'Áo Ghi Lê Công Sở', icon: '👔', price: 310, slot: 'top', style: 'formal', color: '#BDC3C7' },
        { id: 'top_kimono_sakura', name: 'Sakura Kimono', nameVi: 'Kimono Anh Đào', icon: '👘', price: 500, slot: 'top', style: 'fantasy', color: '#FFC0CB' },

        // Bottoms (30 items)
        { id: 'bot_jeans_blue', name: 'Blue Jeans', nameVi: 'Quần Jeans Xanh', icon: '👖', price: 200, slot: 'bottom', style: 'casual', color: '#1565C0' },
        { id: 'bot_jeans_black', name: 'Black Jeans', nameVi: 'Quần Jeans Đen', icon: '👖', price: 200, slot: 'bottom', style: 'casual', color: '#212121' },
        { id: 'bot_shorts_red', name: 'Red Shorts', nameVi: 'Quần Short Đỏ', icon: '🩳', price: 120, slot: 'bottom', style: 'sport', color: '#E53935' },
        { id: 'bot_skirt_plaid', name: 'Plaid Skirt', nameVi: 'Váy Kẻ Caro', icon: '👗', price: 180, slot: 'bottom', style: 'school', color: '#8B0000' },
        { id: 'bot_skirt_tutu', name: 'Tutu Skirt', nameVi: 'Váy Tutu', icon: '👗', price: 300, slot: 'bottom', style: 'fantasy', color: '#FF69B4' },
        { id: 'bot_pants_school', name: 'School Pants', nameVi: 'Quần Đồng Phục', icon: '👖', price: 150, slot: 'bottom', style: 'school', color: '#37474F' },
        { id: 'bot_leggings', name: 'Leggings', nameVi: 'Quần Leggings', icon: '👖', price: 130, slot: 'bottom', style: 'sport', color: '#4A148C' },
        { id: 'bot_jogger', name: 'Jogger Pants', nameVi: 'Quần Jogger', icon: '👖', price: 160, slot: 'bottom', style: 'casual', color: '#607D8B' },
        { id: 'bot_trouser_formal', name: 'Formal Trousers', nameVi: 'Quần Tây Lịch Sự', icon: '👖', price: 280, slot: 'bottom', style: 'formal', color: '#263238' },
        { id: 'bot_skirt_mini', name: 'Mini Skirt', nameVi: 'Váy Ngắn', icon: '👗', price: 160, slot: 'bottom', style: 'casual', color: '#E91E63' },
        { id: 'bot_shorts_denim', name: 'Denim Shorts', nameVi: 'Quần Short Jeans', icon: '🩳', price: 150, slot: 'bottom', style: 'casual', color: '#42A5F5' },
        { id: 'bot_culottes', name: 'Culottes', nameVi: 'Quần Culottes', icon: '👖', price: 220, slot: 'bottom', style: 'casual', color: '#AB47BC' },
        { id: 'bot_cargo', name: 'Cargo Pants', nameVi: 'Quần Cargo', icon: '👖', price: 240, slot: 'bottom', style: 'casual', color: '#5D4037' },
        { id: 'bot_hakama', name: 'Hakama', nameVi: 'Hakama Nhật', icon: '👖', price: 350, slot: 'bottom', style: 'fantasy', color: '#1A237E' },
        { id: 'bot_flare', name: 'Flare Skirt', nameVi: 'Váy Xòe', icon: '👗', price: 200, slot: 'bottom', style: 'casual', color: '#FF7043' },
        { id: 'bot_pants_khaki', name: 'Khaki Pants', nameVi: 'Quần Khaki', icon: '👖', price: 190, slot: 'bottom', style: 'casual', color: '#F5F5DC' },
        { id: 'bot_skirt_long', name: 'Long Skirt', nameVi: 'Váy Dài Thướt Tha', icon: '👗', price: 220, slot: 'bottom', style: 'casual', color: '#5DADE2' },
        { id: 'bot_pants_track', name: 'Track Pants', nameVi: 'Quần Thể Thao', icon: '👖', price: 150, slot: 'bottom', style: 'sport', color: '#27AE60' },
        { id: 'bot_pants_suit', name: 'Suit Trousers', nameVi: 'Quần Âu Công Sở', icon: '👖', price: 260, slot: 'bottom', style: 'formal', color: '#34495E' },
        { id: 'bot_shorts_sport', name: 'Sport Shorts', nameVi: 'Quần Short Thể Thao', icon: '🩳', price: 110, slot: 'bottom', style: 'sport', color: '#1C2833' },
        { id: 'bot_pants_ninja', name: 'Ninja Pants', nameVi: 'Quần Ninja Gọn Gàng', icon: '👖', price: 300, slot: 'bottom', style: 'fantasy', color: '#2C3E50' },
        { id: 'bot_skirt_jeans', name: 'Denim Skirt', nameVi: 'Chân Váy Bò', icon: '👗', price: 190, slot: 'bottom', style: 'casual', color: '#2E86C1' },
        { id: 'bot_pants_cargo_green', name: 'Green Cargo Pants', nameVi: 'Quần Túi Hộp Xanh', icon: '👖', price: 250, slot: 'bottom', style: 'casual', color: '#556B2F' },
        { id: 'bot_skirt_lace', name: 'Lace Skirt', nameVi: 'Chân Váy Ren Điệu', icon: '👗', price: 240, slot: 'bottom', style: 'formal', color: '#FFF0F5' },
        { id: 'bot_leggings_black', name: 'Black Leggings', nameVi: 'Quần Legging Đen', icon: '👖', price: 130, slot: 'bottom', style: 'sport', color: '#1A1A1A' },
        { id: 'bot_pants_overalls', name: 'Denim Overalls', nameVi: 'Quần Yếm Bò', icon: '👖', price: 320, slot: 'bottom', style: 'casual', color: '#3498DB' },
        { id: 'bot_pants_snow', name: 'Snow Pants', nameVi: 'Quần Trượt Tuyết', icon: '👖', price: 290, slot: 'bottom', style: 'seasonal', color: '#AED6F1' },
        { id: 'bot_shorts_khaki', name: 'Khaki Shorts', nameVi: 'Quần Short Khaki', icon: '🩳', price: 140, slot: 'bottom', style: 'casual', color: '#DEB887' },
        { id: 'bot_skirt_pleated_pink', name: 'Pink Pleated Skirt', nameVi: 'Váy Xếp Ly Hồng', icon: '👗', price: 180, slot: 'bottom', style: 'school', color: '#FFB6C1' },
        { id: 'bot_pants_linen', name: 'Linen Pants', nameVi: 'Quần Vải Lanh Rộng', icon: '👖', price: 180, slot: 'bottom', style: 'casual', color: '#EAECEE' },

        // Shoes (20 items)
        { id: 'shoe_sneaker_white', name: 'White Sneakers', nameVi: 'Giày Thể Thao Trắng', icon: '👟', price: 200, slot: 'shoes', style: 'casual', color: '#FFFFFF' },
        { id: 'shoe_sneaker_red', name: 'Red Sneakers', nameVi: 'Giày Thể Thao Đỏ', icon: '👟', price: 200, slot: 'shoes', style: 'sport', color: '#E53935' },
        { id: 'shoe_boots_brown', name: 'Brown Boots', nameVi: 'Bốt Nâu', icon: '👢', price: 350, slot: 'shoes', style: 'casual', color: '#795548' },
        { id: 'shoe_heels', name: 'Pink Heels', nameVi: 'Giày Cao Gót Hồng', icon: '👠', price: 320, slot: 'shoes', style: 'formal', color: '#EC407A' },
        { id: 'shoe_loafers', name: 'School Loafers', nameVi: 'Giày Lười Đồng Phục', icon: '👞', price: 180, slot: 'shoes', style: 'school', color: '#3E2723' },
        { id: 'shoe_sandals', name: 'Summer Sandals', nameVi: 'Dép Mùa Hè', icon: '🩴', price: 130, slot: 'shoes', style: 'casual', color: '#FFCA28' },
        { id: 'shoe_slippers', name: 'Bunny Slippers', nameVi: 'Dép Thỏ', icon: '🐰', price: 150, slot: 'shoes', style: 'casual', color: '#FFC0CB' },
        { id: 'shoe_boots_winter', name: 'Winter Boots', nameVi: 'Bốt Mùa Đông', icon: '👢', price: 380, slot: 'shoes', style: 'seasonal', color: '#37474F' },
        { id: 'shoe_running', name: 'Running Shoes', nameVi: 'Giày Chạy Bộ', icon: '👟', price: 280, slot: 'shoes', style: 'sport', color: '#FF6F00' },
        { id: 'shoe_platform', name: 'Platform Shoes', nameVi: 'Giày Đế Bánh Mì', icon: '👡', price: 300, slot: 'shoes', style: 'casual', color: '#CE93D8' },
        { id: 'shoe_boots_ninja', name: 'Ninja Boots', nameVi: 'Bốt Ninja', icon: '👢', price: 280, slot: 'shoes', style: 'fantasy', color: '#1A1A1A' },
        { id: 'shoe_canvas_black', name: 'Black Canvas Shoes', nameVi: 'Giày Vải Đen', icon: '👟', price: 170, slot: 'shoes', style: 'casual', color: '#2C3E50' },
        { id: 'shoe_sandals_leather', name: 'Leather Sandals', nameVi: 'Xăng Đan Da', icon: '🩴', price: 220, slot: 'shoes', style: 'formal', color: '#8B4513' },
        { id: 'shoe_boots_rain', name: 'Rain Boots', nameVi: 'Ủng Đi Mưa', icon: '👢', price: 190, slot: 'shoes', style: 'seasonal', color: '#F4D03F' },
        { id: 'shoe_sneaker_green', name: 'Green Sneakers', nameVi: 'Giày Thể Thao Xanh', icon: '👟', price: 200, slot: 'shoes', style: 'sport', color: '#2ECC71' },
        { id: 'shoe_slippers_dino', name: 'Dino Slippers', nameVi: 'Dép Khủng Long', icon: '🐰', price: 160, slot: 'shoes', style: 'casual', color: '#58D68D' },
        { id: 'shoe_oxford', name: 'Oxford Shoes', nameVi: 'Giày Da Oxford', icon: '👞', price: 300, slot: 'shoes', style: 'formal', color: '#3E2723' },
        { id: 'shoe_boots_fur', name: 'Fur-lined Boots', nameVi: 'Bốt Lót Lông', icon: '👢', price: 320, slot: 'shoes', style: 'seasonal', color: '#D2691E' },
        { id: 'shoe_sandals_white', name: 'White Sandals', nameVi: 'Xăng Đan Trắng', icon: '🩴', price: 140, slot: 'shoes', style: 'casual', color: '#FFFFFF' },
        { id: 'shoe_ballet', name: 'Ballet Shoes', nameVi: 'Giày Múa Ba Lê', icon: '🩰', price: 250, slot: 'shoes', style: 'fantasy', color: '#FDF2E9' },

        // Head items (10 items)
        { id: 'head_cap_red', name: 'Red Baseball Cap', nameVi: 'Mũ Lưỡi Trai Đỏ', icon: '🧢', price: 120, slot: 'head', style: 'casual', color: '#F44336' },
        { id: 'head_beanie', name: 'Cozy Beanie', nameVi: 'Mũ Len Ấm', icon: '🧢', price: 100, slot: 'head', style: 'seasonal', color: '#FF7043' },
        { id: 'head_graduation', name: 'Graduation Cap', nameVi: 'Mũ Tốt Nghiệp', icon: '🎓', price: 250, slot: 'head', style: 'school', color: '#212121' },
        { id: 'head_witch', name: 'Witch Hat', nameVi: 'Mũ Phù Thủy', icon: '🧙', price: 200, slot: 'head', style: 'fantasy', color: '#4A148C' },
        { id: 'head_crown', name: 'Golden Crown', nameVi: 'Vương Miện Vàng', icon: '👑', price: 500, slot: 'head', style: 'fantasy', color: '#FFD700' },
        { id: 'head_crown_ice', name: 'Ice Crown', nameVi: 'Vương Miện Băng Giá', icon: '👑', price: 550, slot: 'head', style: 'fantasy', color: '#AED6F1' },
        { id: 'head_earmuffs', name: 'Warm Earmuffs', nameVi: 'Bịt Tai Giữ Ấm', icon: '🎧', price: 130, slot: 'head', style: 'seasonal', color: '#FADBD8' },
        { id: 'head_straw_hat', name: 'Straw Hat', nameVi: 'Mũ Rơm Đi Biển', icon: '👒', price: 160, slot: 'head', style: 'casual', color: '#F5CBA7' },
        { id: 'head_chef_hat', name: 'Chef Hat', nameVi: 'Mũ Đầu Bếp', icon: '👨‍🍳', price: 220, slot: 'head', style: 'formal', color: '#FFFFFF' },
        { id: 'head_ribbon_band', name: 'Red Ribbon Hairband', nameVi: 'Băng Đô Nơ Đỏ', icon: '🎀', price: 120, slot: 'head', style: 'school', color: '#E74C3C' },
      ]
    },
    accessories: {
      id: 'shop_accessories',
      name: 'Accessories',
      nameVi: 'Phụ Kiện',
      icon: '💍',
      color: '#43E97B',
      items: [
        // Accessories (50 items)
        { id: 'acc_glasses_round', name: 'Round Glasses', nameVi: 'Kính Tròn', icon: '👓', price: 150, slot: 'glasses', desc: 'Kính tròn thư sinh' },
        { id: 'acc_glasses_sun', name: 'Sunglasses', nameVi: 'Kính Mát', icon: '🕶️', price: 200, slot: 'glasses', desc: 'Kính mát thời trang' },
        { id: 'acc_bag_school', name: 'School Backpack', nameVi: 'Balô Đi Học', icon: '🎒', price: 250, slot: 'bag', desc: 'Balô đi học xinh xắn' },
        { id: 'acc_bag_tote', name: 'Tote Bag', nameVi: 'Túi Tote', icon: '👜', price: 220, slot: 'bag', desc: 'Túi tote thời trang' },
        { id: 'acc_necklace', name: 'Pearl Necklace', nameVi: 'Vòng Cổ Ngọc Trai', icon: '📿', price: 300, slot: 'neck', desc: 'Vòng cổ ngọc trai đẹp' },
        { id: 'acc_bracelet', name: 'Friendship Bracelet', nameVi: 'Vòng Tay Tình Bạn', icon: '💍', price: 120, slot: 'wrist', desc: 'Vòng tay tình bạn' },
        { id: 'acc_scarf', name: 'Wool Scarf', nameVi: 'Khăn Quàng Len', icon: '🧣', price: 160, slot: 'neck', desc: 'Khăn quàng len ấm áp' },
        { id: 'acc_earrings', name: 'Star Earrings', nameVi: 'Hoa Tai Ngôi Sao', icon: '⭐', price: 180, slot: 'ears', desc: 'Hoa tai ngôi sao lấp lánh' },
        { id: 'acc_watch', name: 'Cool Watch', nameVi: 'Đồng Hồ Thời Trang', icon: '⌚', price: 280, slot: 'wrist', desc: 'Đồng hồ thời trang' },
        { id: 'acc_hairpin', name: 'Flower Hairpin', nameVi: 'Kẹp Tóc Hoa', icon: '🌸', price: 90, slot: 'hair', desc: 'Kẹp tóc hình hoa' },
        { id: 'acc_hairband', name: 'Cute Hairband', nameVi: 'Băng Đô Dễ Thương', icon: '🎀', price: 110, slot: 'hair', desc: 'Băng đô dễ thương' },
        { id: 'acc_ring', name: 'Lucky Ring', nameVi: 'Nhẫn May Mắn', icon: '💍', price: 200, slot: 'ring', desc: 'Nhẫn may mắn xinh đẹp' },
        { id: 'acc_umbrella', name: 'Mini Umbrella', nameVi: 'Ô Mini', icon: '☂️', price: 130, slot: 'hand', desc: 'Ô mini thời trang' },
        { id: 'acc_wings', name: 'Fairy Wings', nameVi: 'Cánh Tiên Nữ', icon: '🧚', price: 400, slot: 'back', desc: 'Đôi cánh tiên nữ phép thuật' },
        { id: 'acc_tail', name: 'Fox Tail', nameVi: 'Đuôi Cáo', icon: '🦊', price: 350, slot: 'back', desc: 'Đuôi cáo đáng yêu' },
        { id: 'acc_mask', name: 'Masquerade Mask', nameVi: 'Mặt Nạ Vũ Hội', icon: '🎭', price: 220, slot: 'face', desc: 'Mặt nạ vũ hội bí ẩn' },
        { id: 'acc_badge', name: 'Star Badge', nameVi: 'Huy Hiệu Sao', icon: '🌟', price: 100, slot: 'chest', desc: 'Huy hiệu ngôi sao' },
        { id: 'acc_lanyard', name: 'ID Lanyard', nameVi: 'Dây Đeo Thẻ', icon: '🪪', price: 80, slot: 'neck', desc: 'Dây đeo thẻ học sinh' },
        { id: 'acc_handbag', name: 'Mini Handbag', nameVi: 'Túi Xách Mini', icon: '👛', price: 240, slot: 'hand', desc: 'Túi xách mini xinh xắn' },
        { id: 'acc_bow', name: 'Giant Hair Bow', nameVi: 'Nơ Tóc Lớn', icon: '🎀', price: 150, slot: 'hair', desc: 'Nơ tóc siêu to siêu đáng yêu' },
        { id: 'acc_glasses_heart', name: 'Heart Glasses', nameVi: 'Kính Trái Tim', icon: '🕶️', price: 180, slot: 'glasses', desc: 'Kính hình trái tim đáng yêu' },
        { id: 'acc_scarf_stripes', name: 'Striped Scarf', nameVi: 'Khăn Choàng Sọc', icon: '🧣', price: 150, slot: 'neck', desc: 'Khăn choàng sọc kẻ thời trang' },
        { id: 'acc_headphones', name: 'Headphones', nameVi: 'Tai Nghe Chụp Tai', icon: '🎧', price: 320, slot: 'hair', desc: 'Tai nghe chụp tai sành điệu' },
        { id: 'acc_wings_bat', name: 'Bat Wings', nameVi: 'Cánh Dơi Hắc Ám', icon: '🦇', price: 450, slot: 'back', desc: 'Đôi cánh dơi hắc ám' },
        { id: 'acc_balloon', name: 'Red Balloon', nameVi: 'Bong Bóng Bay', icon: '🎈', price: 100, slot: 'hand', desc: 'Bong bóng màu đỏ dễ thương' },
        { id: 'acc_book_magic', name: 'Magic Book', nameVi: 'Sách Phép Thuật', icon: '📖', price: 400, slot: 'hand', desc: 'Cuốn sách phép thuật cổ xưa' },
        { id: 'acc_badge_gold', name: 'Gold Star Badge', nameVi: 'Huy Hiệu Vàng', icon: '🌟', price: 150, slot: 'chest', desc: 'Huy hiệu ngôi sao vàng sáng chói' },
        { id: 'acc_glasses_nerd', name: 'Nerd Glasses', nameVi: 'Kính Mắt Ngố', icon: '👓', price: 120, slot: 'glasses', desc: 'Kính mắt ngố tri thức' },
        { id: 'acc_ribbon_red', name: 'Red Neck Ribbon', nameVi: 'Nơ Cổ Đỏ', icon: '🎀', price: 100, slot: 'neck', desc: 'Nơ cổ màu đỏ xinh xắn' },
        { id: 'acc_backpack_kitty', name: 'Kitty Backpack', nameVi: 'Balô Mèo Con', icon: '🎒', price: 280, slot: 'bag', desc: 'Balô hình chú mèo dễ thương' },
        { id: 'acc_glasses_oval', name: 'Oval Glasses', nameVi: 'Kính Oval', icon: '👓', price: 140, slot: 'glasses', desc: 'Kính mắt oval thời thượng' },
        { id: 'acc_scarf_green', name: 'Green Scarf', nameVi: 'Khăn Choàng Xanh', icon: '🧣', price: 140, slot: 'neck', desc: 'Khăn choàng màu xanh lá' },
        { id: 'acc_mask_cat', name: 'Cat Mask', nameVi: 'Mặt Nạ Mèo', icon: '🎭', price: 250, slot: 'face', desc: 'Mặt nạ mèo ngộ nghĩnh' },
        { id: 'acc_badge_silver', name: 'Silver Badge', nameVi: 'Huy Hiệu Bạc', icon: '🌟', price: 100, slot: 'chest', desc: 'Huy hiệu sao bạc lấp lánh' },
        { id: 'acc_bag_crossbody', name: 'Crossbody Bag', nameVi: 'Túi Đeo Chéo', icon: '👜', price: 200, slot: 'bag', desc: 'Túi đeo chéo nhỏ gọn' },
        { id: 'acc_umbrella_red', name: 'Red Umbrella', nameVi: 'Ô Đỏ Che Mưa', icon: '☂️', price: 150, slot: 'hand', desc: 'Ô che mưa màu đỏ rực rỡ' },
        { id: 'acc_sword_toy', name: 'Toy Sword', nameVi: 'Kiếm Đồ Chơi', icon: '⚔️', price: 350, slot: 'hand', desc: 'Thanh kiếm nhựa đồ chơi' },
        { id: 'acc_shield_toy', name: 'Toy Shield', nameVi: 'Khiên Đồ Chơi', icon: '🛡️', price: 300, slot: 'back', desc: 'Khiên đồ chơi bảo vệ' },
        { id: 'acc_cape_red', name: 'Red Cape', nameVi: 'Áo Choàng Đỏ', icon: '🧥', price: 400, slot: 'back', desc: 'Áo choàng màu đỏ quyền quý' },
        { id: 'acc_tie_formal', name: 'Blue Tie', nameVi: 'Cà Vạt Công Sở', icon: '👔', price: 120, slot: 'neck', desc: 'Cà vạt xanh lịch lãm' },
        { id: 'acc_bow_tie', name: 'Bow Tie', nameVi: 'Nơ Đeo Cổ', icon: '🎀', price: 90, slot: 'neck', desc: 'Nơ thắt cổ sang trọng' },
        { id: 'acc_crown_flower', name: 'Flower Crown', nameVi: 'Vòng Hoa Đội Đầu', icon: '👑', price: 220, slot: 'hair', desc: 'Vòng hoa đội đầu xinh đẹp' },
        { id: 'acc_ears_cat', name: 'Cat Ears Headband', nameVi: 'Tai Mèo Gắn Tóc', icon: '🎀', price: 200, slot: 'hair', desc: 'Tai mèo gắn tóc ngộ nghĩnh' },
        { id: 'acc_ears_bunny', name: 'Bunny Ears Headband', nameVi: 'Tai Thỏ Gắn Tóc', icon: '🎀', price: 200, slot: 'hair', desc: 'Tai thỏ bông mềm mịn' },
        { id: 'acc_wings_angel', name: 'Angel Wings', nameVi: 'Cánh Thiên Thần', icon: '🧚', price: 500, slot: 'back', desc: 'Cánh thiên thần trắng muốt' },
        { id: 'acc_wand_magic', name: 'Magic Wand', nameVi: 'Gậy Phép Thuật', icon: '🪄', price: 450, slot: 'hand', desc: 'Gậy phép thuật lấp lánh' },
        { id: 'acc_guitar_toy', name: 'Toy Guitar', nameVi: 'Đàn Guitar Đồ Chơi', icon: '🎸', price: 480, slot: 'back', desc: 'Đàn guitar đồ chơi trên vai' },
        { id: 'acc_backpack_frog', name: 'Frog Backpack', nameVi: 'Balô Ếch Xanh', icon: '🎒', price: 280, slot: 'bag', desc: 'Balô hình ếch xanh ngộ nghĩnh' },
        { id: 'acc_glasses_star', name: 'Star Glasses', nameVi: 'Kính Ngôi Sao', icon: '🕶️', price: 180, slot: 'glasses', desc: 'Mắt kính hình ngôi sao tinh nghịch' },
        { id: 'acc_scarf_yellow', name: 'Yellow Scarf', nameVi: 'Khăn Choàng Vàng', icon: '🧣', price: 140, slot: 'neck', desc: 'Khăn choàng ấm màu vàng' },
      ]
    },
    furniture: {
      id: 'shop_furniture',
      name: 'Furniture Store',
      nameVi: 'Cửa Hàng Nội Thất',
      icon: '🛋️',
      color: '#F7971E',
      items: [
        { id: 'fur_bed_single', name: 'Single Bed', nameVi: 'Giường Đơn', icon: '🛏️', price: 400, room: 'bedroom', desc: 'Giường đơn thoải mái' },
        { id: 'fur_bed_double', name: 'Double Bed', nameVi: 'Giường Đôi', icon: '🛏️', price: 600, room: 'bedroom', desc: 'Giường đôi rộng rãi' },
        { id: 'fur_pet_bed', name: 'Pet Cushion Bed', nameVi: 'Ổ Thú Cưng', icon: '🧺', price: 250, room: 'bedroom', desc: 'Ổ đệm ấm áp cho thú cưng ngủ' },
        { id: 'fur_desk_study', name: 'Study Desk', nameVi: 'Bàn Học', icon: '🪑', price: 300, room: 'bedroom', desc: 'Bàn học thông minh' },
        { id: 'fur_chair_spin', name: 'Spinning Chair', nameVi: 'Ghế Xoay', icon: '🪑', price: 350, room: 'bedroom', desc: 'Ghế xoay tiện lợi' },
        { id: 'fur_wardrobe', name: 'Wardrobe', nameVi: 'Tủ Quần Áo', icon: '🚪', price: 500, room: 'bedroom', desc: 'Tủ quần áo rộng lớn' },
        { id: 'fur_tv', name: 'Smart TV', nameVi: 'Tivi Thông Minh', icon: '📺', price: 700, room: 'living', desc: 'TV màn hình lớn' },
        { id: 'fur_fridge', name: 'Refrigerator', nameVi: 'Tủ Lạnh', icon: '🧊', price: 650, room: 'kitchen', desc: 'Tủ lạnh giữ lạnh tốt' },
        { id: 'fur_sofa', name: 'Comfortable Sofa', nameVi: 'Sofa Thoải Mái', icon: '🛋️', price: 800, room: 'living', desc: 'Sofa da sang trọng' },
        { id: 'fur_coffee_table', name: 'Coffee Table', nameVi: 'Bàn Trà', icon: '🪞', price: 280, room: 'living', desc: 'Bàn trà gỗ tự nhiên' },
        { id: 'fur_rug', name: 'Cozy Rug', nameVi: 'Thảm Ấm', icon: '🪣', price: 220, room: 'living', desc: 'Thảm len ấm áp' },
        { id: 'fur_nightstand', name: 'Nightstand', nameVi: 'Tủ Đầu Giường', icon: '🪵', price: 200, room: 'bedroom', desc: 'Tủ đầu giường nhỏ gọn' },
        { id: 'fur_bookshelf', name: 'Bookshelf', nameVi: 'Kệ Sách', icon: '📚', price: 380, room: 'bedroom', desc: 'Kệ sách nhiều tầng' },
        { id: 'fur_lamp_stand', name: 'Floor Lamp', nameVi: 'Đèn Đứng', icon: '💡', price: 250, room: 'living', desc: 'Đèn đứng chiếu sáng' },
        { id: 'fur_vanity', name: 'Vanity Table', nameVi: 'Bàn Phấn', icon: '🪞', price: 450, room: 'bedroom', desc: 'Bàn phấn trang điểm' },
        { id: 'fur_armchair', name: 'Armchair', nameVi: 'Ghế Sofa Đơn', icon: '🪑', price: 420, room: 'living', desc: 'Ghế sofa đơn thư giãn' },
        { id: 'fur_computer', name: 'Desktop Computer', nameVi: 'Máy Tính Bàn', icon: '🖥️', price: 750, room: 'bedroom', desc: 'Máy tính bàn hiện đại' },
        { id: 'fur_plant_pot', name: 'Large Plant Pot', nameVi: 'Chậu Cây Lớn', icon: '🪴', price: 180, room: 'living', desc: 'Chậu cây xanh tươi' },
        { id: 'fur_mirror', name: 'Full Length Mirror', nameVi: 'Gương Toàn Thân', icon: '🪞', price: 300, room: 'bedroom', desc: 'Gương soi toàn thân' },
        { id: 'fur_microwave', name: 'Microwave', nameVi: 'Lò Vi Sóng', icon: '📡', price: 400, room: 'kitchen', desc: 'Lò vi sóng đa năng' },
        { id: 'fur_washer', name: 'Washing Machine', nameVi: 'Máy Giặt', icon: '🫧', price: 600, room: 'bathroom', desc: 'Máy giặt cửa trước' },
        { id: 'fur_bunk_bed', name: 'Bunk Bed', nameVi: 'Giường Tầng', icon: '🛏️', price: 550, room: 'bedroom', desc: 'Giường tầng tiết kiệm diện tích' },
        { id: 'fur_gaming_chair', name: 'Gaming Chair', nameVi: 'Ghế Gaming', icon: '🪑', price: 400, room: 'bedroom', desc: 'Ghế chơi game êm ái chuyên nghiệp' },
        { id: 'fur_dining_table', name: 'Dining Table', nameVi: 'Bàn Ăn Lớn', icon: '🪑', price: 600, room: 'kitchen', desc: 'Bàn ăn gia đình rộng rãi' },
        { id: 'fur_dining_chair', name: 'Dining Chair', nameVi: 'Ghế Bàn Ăn', icon: '🪑', price: 150, room: 'kitchen', desc: 'Ghế ăn gỗ đồng bộ' },
        { id: 'fur_kitchen_cabinet', name: 'Kitchen Counter', nameVi: 'Tủ Bếp', icon: '🚪', price: 700, room: 'kitchen', desc: 'Hệ tủ bếp hiện đại tiện ích' },
        { id: 'fur_piano', name: 'Grand Piano', nameVi: 'Đàn Piano', icon: '🎹', price: 1200, room: 'living', desc: 'Đàn piano cổ điển sang trọng' },
        { id: 'fur_beanbag', name: 'Beanbag Chair', nameVi: 'Ghế Lười', icon: '🛋️', price: 200, room: 'living', desc: 'Ghế lười hạt xốp thư giãn' },
        { id: 'fur_aquarium', name: 'Fish Aquarium', nameVi: 'Bể Cá Cảnh', icon: '🫧', price: 800, room: 'living', desc: 'Bể cá cảnh thư giãn' },
        { id: 'fur_fireplace', name: 'Cozy Fireplace', nameVi: 'Lò Sưởi Ấm', icon: '🪵', price: 950, room: 'living', desc: 'Lò sưởi gạch ấm áp cho căn phòng' },
        { id: 'fur_tv_cabinet', name: 'TV Cabinet', nameVi: 'Kệ Tivi', icon: '📺', price: 450, room: 'living', desc: 'Kệ tivi gỗ hiện đại' },
        { id: 'fur_bookshelf_modern', name: 'Modern Bookshelf', nameVi: 'Kệ Sách Hiện Đại', icon: '📚', price: 520, room: 'bedroom', desc: 'Kệ sách tối giản nhiều ngăn' },
        { id: 'fur_desk_gaming', name: 'Gaming Desk', nameVi: 'Bàn Học Gaming', icon: '🖥️', price: 480, room: 'bedroom', desc: 'Bàn học rộng rãi kiểu dáng gaming' },
        { id: 'fur_chest_drawers', name: 'Chest of Drawers', nameVi: 'Tủ Nhiều Ngăn', icon: '🗄️', price: 420, room: 'bedroom', desc: 'Tủ ngăn kéo tiện lợi đựng quần áo' },
        { id: 'fur_coffee_table_glass', name: 'Glass Coffee Table', nameVi: 'Bàn Trà Kính', icon: '🪟', price: 320, room: 'living', desc: 'Bàn trà mặt kính sang trọng' },
        { id: 'fur_shoe_cabinet', name: 'Shoe Cabinet', nameVi: 'Tủ Giày', icon: '🥾', price: 260, room: 'living', desc: 'Tủ đựng giày ngăn nắp' },
        { id: 'fur_kitchen_shelf', name: 'Kitchen Shelf', nameVi: 'Kệ Bếp Treo', icon: '🪵', price: 350, room: 'kitchen', desc: 'Kệ gỗ treo tường đựng gia vị' },
        { id: 'fur_dining_table_small', name: 'Small Dining Table', nameVi: 'Bàn Ăn Nhỏ', icon: '🪑', price: 380, room: 'kitchen', desc: 'Bàn ăn nhỏ hình tròn ấm cúng' },
        { id: 'fur_stool', name: 'Wooden Stool', nameVi: 'Ghế Đôn Gỗ', icon: '🪑', price: 100, room: 'kitchen', desc: 'Ghế đôn gỗ nhỏ gọn' },
        { id: 'fur_water_dispenser', name: 'Water Dispenser', nameVi: 'Máy Lọc Nước', icon: '🚰', price: 500, room: 'kitchen', desc: 'Máy lọc nước sạch hiện đại' },
        { id: 'fur_bathtub', name: 'Bathtub', nameVi: 'Bồn Tắm', icon: '🛁', price: 900, room: 'bathroom', desc: 'Bồn tắm sứ trắng sang trọng' },
        { id: 'fur_sink', name: 'Bathroom Sink', nameVi: 'Bồn Rửa Mặt', icon: '🚰', price: 400, room: 'bathroom', desc: 'Bồn rửa mặt sứ kèm tủ' },
        { id: 'fur_toilet', name: 'Toilet', nameVi: 'Bồn Cầu', icon: '🚽', price: 350, room: 'bathroom', desc: 'Bồn cầu sứ trắng' },
        { id: 'fur_laundry_basket', name: 'Laundry Basket', nameVi: 'Giỏ Đồ Giặt', icon: '🧺', price: 120, room: 'bathroom', desc: 'Giỏ đựng quần áo giặt' },
        { id: 'fur_towel_rack', name: 'Towel Rack', nameVi: 'Giá Treo Khăn', icon: '🪵', price: 150, room: 'bathroom', desc: 'Giá treo khăn tắm bằng gỗ' },
        { id: 'fur_pet_house', name: 'Pet House', nameVi: 'Nhà Thú Cưng', icon: '🏠', price: 600, room: 'bedroom', desc: 'Nhà gỗ nhỏ xinh cho chó mèo' },
        { id: 'fur_pet_feeder', name: 'Pet Feeder', nameVi: 'Máy Cho Ăn', icon: '🥣', price: 320, room: 'kitchen', desc: 'Máy cho thú cưng ăn tự động' },
        { id: 'fur_sofa_long', name: 'Long Sofa', nameVi: 'Sofa Dài', icon: '🛋️', price: 1100, room: 'living', desc: 'Ghế sofa dài cao cấp' },
        { id: 'fur_desk_lamp', name: 'Desk Lamp', nameVi: 'Đèn Bàn Học', icon: '💡', price: 150, room: 'bedroom', desc: 'Đèn để bàn học chiếu sáng tốt' },
        { id: 'fur_coat_hanger', name: 'Coat Hanger', nameVi: 'Cây Treo Đồ', icon: '🪵', price: 180, room: 'bedroom', desc: 'Cây treo quần áo và mũ nón' },
      ]
    },
    decor: {
      id: 'shop_decor',
      name: 'Decoration Shop',
      nameVi: 'Đồ Trang Trí',
      icon: '🌸',
      color: '#FF6584',
      items: [
        { id: 'dec_painting', name: 'Wall Painting', nameVi: 'Tranh Tường', icon: '🖼️', price: 200, desc: 'Tranh tường nghệ thuật' },
        { id: 'dec_plant_small', name: 'Succulent', nameVi: 'Cây Xương Rồng', icon: '🌵', price: 100, desc: 'Cây xương rồng dễ chăm' },
        { id: 'dec_led_lights', name: 'LED String Lights', nameVi: 'Đèn LED', icon: '✨', price: 180, desc: 'Đèn LED trang trí lung linh' },
        { id: 'dec_photo_frame', name: 'Photo Frame', nameVi: 'Khung Ảnh', icon: '🖼️', price: 120, desc: 'Khung ảnh kỷ niệm' },
        { id: 'dec_doormat', name: 'Cute Doormat', nameVi: 'Thảm Chùi Chân', icon: '🚪', price: 90, desc: 'Thảm chùi chân dễ thương' },
        { id: 'dec_curtain', name: 'Floral Curtain', nameVi: 'Rèm Hoa', icon: '🪟', price: 220, desc: 'Rèm cửa họa tiết hoa' },
        { id: 'dec_cushion', name: 'Decorative Cushion', nameVi: 'Gối Trang Trí', icon: '🪆', price: 130, desc: 'Gối trang trí đa màu' },
        { id: 'dec_clock', name: 'Wall Clock', nameVi: 'Đồng Hồ Treo Tường', icon: '🕰️', price: 250, desc: 'Đồng hồ treo tường cổ điển' },
        { id: 'dec_xmas_tree', name: 'Mini Xmas Tree', nameVi: 'Cây Thông Nhỏ', icon: '🎄', price: 300, desc: 'Cây thông Noel mini' },
        { id: 'dec_flower_vase', name: 'Flower Vase', nameVi: 'Bình Hoa', icon: '💐', price: 160, desc: 'Bình hoa trang trí' },
        { id: 'dec_candle', name: 'Scented Candle', nameVi: 'Nến Thơm', icon: '🕯️', price: 110, desc: 'Nến thơm thư giãn' },
        { id: 'dec_wall_hook', name: 'Decorative Hook', nameVi: 'Móc Treo Tường', icon: '🪝', price: 80, desc: 'Móc treo tường trang trí' },
        { id: 'dec_windchime', name: 'Wind Chime', nameVi: 'Phong Linh', icon: '🎐', price: 150, desc: 'Phong linh kêu du dương' },
        { id: 'dec_music_box', name: 'Music Box', nameVi: 'Hộp Nhạc', icon: '🎵', price: 350, desc: 'Hộp nhạc phát nhạc êm dịu' },
        { id: 'dec_poster', name: 'Cute Poster', nameVi: 'Poster Dễ Thương', icon: '📌', price: 140, desc: 'Poster in hình cute' },
        { id: 'dec_rug_welcome', name: 'Welcome Mat', nameVi: 'Thảm Chào Mừng', icon: '🪣', price: 80, desc: 'Thảm chào mừng khách đến chơi' },
        { id: 'dec_mirror_wall', name: 'Wall Mirror', nameVi: 'Gương Treo Tường', icon: '🪞', price: 150, desc: 'Gương treo tường tiện lợi' },
        { id: 'dec_plant_hanging', name: 'Hanging Plant', nameVi: 'Cây Treo Tường', icon: '🪴', price: 120, desc: 'Chậu cây dây leo trang trí xanh mát' },
        { id: 'dec_calendar', name: 'Wall Calendar', nameVi: 'Lịch Treo Tường', icon: '📌', price: 50, desc: 'Lịch treo tường theo dõi ngày tháng' },
        { id: 'dec_tissue_box', name: 'Tissue Box', nameVi: 'Hộp Khăn Giấy', icon: '📦', price: 40, desc: 'Hộp khăn giấy xinh xắn đầu giường' },
        { id: 'dec_rug_star', name: 'Star Rug', nameVi: 'Thảm Ngôi Sao', icon: '⭐', price: 90, desc: 'Thảm nỉ hình ngôi sao vàng' },
        { id: 'dec_painting_sunset', name: 'Sunset Painting', nameVi: 'Tranh Hoàng Hôn', icon: '🖼️', price: 220, desc: 'Bức tranh phong cảnh hoàng hôn ấm áp' },
        { id: 'dec_cushion_cat', name: 'Cat Cushion', nameVi: 'Gối Ôm Hình Mèo', icon: '🐱', price: 140, desc: 'Gối ôm bông hình chú mèo dễ thương' },
        { id: 'dec_plant_monstera', name: 'Monstera Plant', nameVi: 'Chậu Trầu Bà Nam Mỹ', icon: '🪴', price: 160, desc: 'Chậu cây lá xẻ xanh mát' },
        { id: 'dec_books_pile', name: 'Pile of Books', nameVi: 'Chồng Sách Cũ', icon: '📚', price: 80, desc: 'Chồng sách cổ kính trang nhã' },
        { id: 'dec_cup_hot_chocolate', name: 'Hot Cocoa Cup', nameVi: 'Cốc Ca Cao Nóng', icon: '☕', price: 50, desc: 'Cốc ca cao nóng bốc khói nhẹ' },
        { id: 'dec_tissue_roll', name: 'Toilet Roll', nameVi: 'Giấy Vệ Sinh', icon: '🧻', price: 30, desc: 'Cuộn giấy vệ sinh tiện dụng' },
        { id: 'dec_wall_clock_modern', name: 'Modern Wall Clock', nameVi: 'Đồng Hồ Hiện Đại', icon: '🕰️', price: 200, desc: 'Đồng hồ treo tường phong cách tối giản' },
        { id: 'dec_rug_heart', name: 'Heart Rug', nameVi: 'Thảm Trái Tim', icon: '💖', price: 100, desc: 'Thảm mềm hình trái tim hồng' },
        { id: 'dec_painting_cat', name: 'Cat Painting', nameVi: 'Tranh Mèo Con', icon: '🖼️', price: 150, desc: 'Tranh vẽ chú mèo con ngộ nghĩnh' },
        { id: 'dec_slipper_rack', name: 'Slipper Rack', nameVi: 'Kệ Dép Nhỏ', icon: '🩴', price: 120, desc: 'Kệ gỗ nhỏ đựng dép trong nhà' },
        { id: 'dec_snowglobe', name: 'Christmas Snowglobe', nameVi: 'Quả Cầu Tuyết', icon: '🔮', price: 180, desc: 'Quả cầu tuyết lung linh' },
        { id: 'dec_alarm_clock', name: 'Retro Alarm Clock', nameVi: 'Đồng Hồ Báo Thức', icon: '⏰', price: 90, desc: 'Đồng hồ báo thức phong cách retro' },
        { id: 'dec_plant_cactus_tall', name: 'Tall Cactus', nameVi: 'Cây Xương Rồng Cao', icon: '🌵', price: 130, desc: 'Chậu cây xương rồng dáng cao' },
        { id: 'dec_board_game', name: 'Board Game Box', nameVi: 'Hộp Cờ Tỷ Phú', icon: '🎲', price: 250, desc: 'Hộp cờ tỷ phú giải trí' },
        { id: 'dec_lava_lamp', name: 'Lava Lamp', nameVi: 'Đèn Dung Nham', icon: '🔮', price: 280, desc: 'Đèn dung nham chuyển màu kỳ ảo' },
        { id: 'dec_calendar_cat', name: 'Cat Calendar', nameVi: 'Lịch Hình Mèo', icon: '📅', price: 60, desc: 'Lịch để bàn in hình mèo dễ thương' },
        { id: 'dec_plate_fruits', name: 'Fruit Plate', nameVi: 'Đĩa Trái Cây', icon: '🍎', price: 110, desc: 'Đĩa trái cây tươi đầy màu sắc' },
        { id: 'dec_diffuser', name: 'Aroma Diffuser', nameVi: 'Máy Xông Tinh Dầu', icon: '🧴', price: 210, desc: 'Máy khuếch tán tinh dầu thơm thư giãn' },
        { id: 'dec_wall_stickers', name: 'Star Wall Stickers', nameVi: 'Decal Dán Tường', icon: '⭐', price: 70, desc: 'Bộ decal dán tường hình ngôi sao dạ quang' },
      ]
    }
  }
};

// =============================================
// DYNAMIC ITEM GENERATION TO MEET TARGET COUNTS
// =============================================

// Colors list for variety
const topColors = [
  { hex: '#A569BD', name: 'Tím Oải Hương', nameEn: 'Lavender' },
  { hex: '#5DADE2', name: 'Xanh Lam Sáng', nameEn: 'Light Blue' },
  { hex: '#48C9B0', name: 'Xanh Mint Đậm', nameEn: 'Teal' },
  { hex: '#F4D03F', name: 'Vàng Chanh', nameEn: 'Lemon Yellow' },
  { hex: '#EB984E', name: 'Cam Nắng', nameEn: 'Warm Orange' },
  { hex: '#EC7063', name: 'Đỏ San Hô', nameEn: 'Coral Red' },
  { hex: '#AF7AC5', name: 'Tím Phong Lan', nameEn: 'Orchid Purple' },
  { hex: '#52BE80', name: 'Xanh Lá Nhạt', nameEn: 'Light Green' },
  { hex: '#F5B041', name: 'Màu Mơ Chín', nameEn: 'Apricot' },
  { hex: '#58D68D', name: 'Xanh Ngọc Lục', nameEn: 'Emerald' }
];

const stylesList = ['casual', 'school', 'sport', 'formal', 'fantasy', 'seasonal'];

// 1. CLOTHING: Target 200 items (100 existing + 100 generated)
// Generate 40 Tops
for (let i = 1; i <= 40; i++) {
  const colorObj = topColors[(i - 1) % topColors.length];
  const style = stylesList[(i - 1) % stylesList.length];
  GAME_DATA.shops.clothes.items.push({
    id: `top_gen_${i}`,
    name: `Cozy ${colorObj.nameEn} Top`,
    nameVi: `Áo ${colorObj.name} (${style === 'casual' ? 'Thường' : style === 'school' ? 'Học Đường' : style === 'sport' ? 'Thể Thao' : style === 'formal' ? 'Lịch Lãm' : style === 'fantasy' ? 'Phép Thuật' : 'Lễ Hội'})`,
    icon: '👕',
    price: 150 + (i % 6) * 30,
    slot: 'top',
    style: style,
    color: colorObj.hex,
    gender: 'all'
  });
}

// Generate 30 Bottoms
for (let i = 1; i <= 30; i++) {
  const colorObj = topColors[(i - 1) % topColors.length];
  const style = stylesList[(i - 1) % stylesList.length];
  GAME_DATA.shops.clothes.items.push({
    id: `bot_gen_${i}`,
    name: `Cozy ${colorObj.nameEn} Bottom`,
    nameVi: `Quần/Váy ${colorObj.name} (${style === 'casual' ? 'Thường' : style === 'school' ? 'Học Đường' : style === 'sport' ? 'Thể Thao' : style === 'formal' ? 'Lịch Lãm' : style === 'fantasy' ? 'Phép Thuật' : 'Lễ Hội'})`,
    icon: '👖',
    price: 120 + (i % 5) * 40,
    slot: 'bottom',
    style: style,
    color: colorObj.hex,
    gender: 'all'
  });
}

// Generate 20 Shoes
for (let i = 1; i <= 20; i++) {
  const colorObj = topColors[(i - 1) % topColors.length];
  const style = stylesList[(i - 1) % stylesList.length];
  GAME_DATA.shops.clothes.items.push({
    id: `shoe_gen_${i}`,
    name: `Cozy ${colorObj.nameEn} Shoes`,
    nameVi: `Giày ${colorObj.name} (${style === 'casual' ? 'Thường' : style === 'school' ? 'Học Đường' : style === 'sport' ? 'Thể Thao' : style === 'formal' ? 'Lịch Lãm' : style === 'fantasy' ? 'Phép Thuật' : 'Lễ Hội'})`,
    icon: '👟',
    price: 180 + (i % 4) * 30,
    slot: 'shoes',
    style: style,
    color: colorObj.hex,
    gender: 'all'
  });
}

// Generate 10 Head items
for (let i = 1; i <= 10; i++) {
  const colorObj = topColors[(i - 1) % topColors.length];
  const style = stylesList[(i - 1) % stylesList.length];
  GAME_DATA.shops.clothes.items.push({
    id: `head_gen_${i}`,
    name: `Cozy ${colorObj.nameEn} Hat`,
    nameVi: `Mũ ${colorObj.name} (${style === 'casual' ? 'Thường' : style === 'school' ? 'Học Đường' : style === 'sport' ? 'Thể Thao' : style === 'formal' ? 'Lịch Lãm' : style === 'fantasy' ? 'Phép Thuật' : 'Lễ Hội'})`,
    icon: '🧢',
    price: 130 + (i % 3) * 50,
    slot: 'head',
    style: style,
    color: colorObj.hex,
    gender: 'all'
  });
}

// 2. ACCESSORIES: Target 80 items (50 existing + 30 generated)
const accSlotsList = [
  { slot: 'glasses', icon: '👓', label: 'Kính Mắt' },
  { slot: 'bag', icon: '🎒', label: 'Ba Lô' },
  { slot: 'neck', icon: '🧣', label: 'Khăn Quàng' },
  { slot: 'hair', icon: '🎀', label: 'Cài Tóc' },
  { slot: 'back', icon: '🧚', label: 'Cánh Tiên' },
  { slot: 'hand', icon: '☂️', label: 'Ô Cầm Tay' },
  { slot: 'face', icon: '🎭', label: 'Mặt Nạ' }
];

for (let i = 1; i <= 30; i++) {
  const slotObj = accSlotsList[(i - 1) % accSlotsList.length];
  const colorObj = topColors[(i - 1) % topColors.length];
  GAME_DATA.shops.accessories.items.push({
    id: `acc_gen_${i}`,
    name: `Special ${colorObj.nameEn} ${slotObj.slot}`,
    nameVi: `${slotObj.label} ${colorObj.name}`,
    icon: slotObj.icon,
    price: 140 + (i % 5) * 40,
    slot: slotObj.slot,
    color: colorObj.hex,
    desc: `Phụ kiện làm đẹp màu ${colorObj.name.toLowerCase()}`,
    gender: 'all'
  });
}

// 3. FURNITURE: Target 100 items (50 existing + 50 generated)
const furnitureRoomsList = [
  { room: 'bedroom', label: 'Phòng Ngủ' },
  { room: 'living', label: 'Phòng Khách' },
  { room: 'kitchen', label: 'Phòng Bếp' },
  { room: 'bathroom', label: 'Phòng Tắm' }
];

const furnitureTypesList = [
  { nameEn: 'Sofa', nameVi: 'Ghế Sofa', icon: '🛋️', w: 80, h: 60 },
  { nameEn: 'Table', nameVi: 'Bàn Trà Gỗ', icon: '🪑', w: 70, h: 45 },
  { nameEn: 'Cabinet', nameVi: 'Tủ Đồ', icon: '🚪', w: 75, h: 90 },
  { nameEn: 'Chair', nameVi: 'Ghế Bành', icon: '🪑', w: 50, h: 65 },
  { nameEn: 'Shelf', nameVi: 'Kệ Trưng Bày', icon: '📚', w: 80, h: 100 },
  { nameEn: 'Nightstand', nameVi: 'Kệ Đầu Giường', icon: '🪵', w: 45, h: 50 }
];

for (let i = 1; i <= 50; i++) {
  const roomObj = furnitureRoomsList[(i - 1) % furnitureRoomsList.length];
  const typeObj = furnitureTypesList[(i - 1) % furnitureTypesList.length];
  const colorObj = topColors[(i - 1) % topColors.length];
  
  GAME_DATA.shops.furniture.items.push({
    id: `fur_gen_${i}`,
    name: `${colorObj.nameEn} ${roomObj.room} ${typeObj.nameEn}`,
    nameVi: `${typeObj.nameVi} ${colorObj.name} (${roomObj.label})`,
    icon: typeObj.icon,
    price: 220 + (i % 6) * 50,
    room: roomObj.room,
    color: colorObj.hex,
    desc: `Món đồ nội thất sơn màu ${colorObj.name.toLowerCase()} cho căn phòng của bạn`,
    w: typeObj.w,
    h: typeObj.h
  });
}

// 4. DECOR: Target 60 items (40 existing + 20 generated)
const decorTypesList = [
  { nameEn: 'Painting', nameVi: 'Tranh Treo Tường', icon: '🖼️', w: 60, h: 45 },
  { nameEn: 'Flower Vase', nameVi: 'Lọ Hoa Cảnh', icon: '💐', w: 35, h: 50 },
  { nameEn: 'Soft Rug', nameVi: 'Thảm Êm', icon: '🪣', w: 65, h: 30 },
  { nameEn: 'Clock', nameVi: 'Đồng Hồ Cổ Điển', icon: '🕰️', w: 40, h: 40 },
  { nameEn: 'Plant Pot', nameVi: 'Chậu Cây Nhỏ', icon: '🪴', w: 30, h: 40 },
  { nameEn: 'Candle', nameVi: 'Nến Thơm', icon: '🕯️', w: 25, h: 35 }
];

for (let i = 1; i <= 20; i++) {
  const typeObj = decorTypesList[(i - 1) % decorTypesList.length];
  const colorObj = topColors[(i - 1) % topColors.length];
  
  GAME_DATA.shops.decor.items.push({
    id: `dec_gen_${i}`,
    name: `${colorObj.nameEn} ${typeObj.nameEn}`,
    nameVi: `${typeObj.nameVi} ${colorObj.name}`,
    icon: typeObj.icon,
    price: 90 + (i % 4) * 30,
    color: colorObj.hex,
    desc: `Đồ trang trí màu ${colorObj.name.toLowerCase()} giúp ngôi nhà xinh xắn hơn`,
    w: typeObj.w,
    h: typeObj.h
  });
}

// Populate pet shop items from pets data

GAME_DATA.shops.pets.items = [
  ...GAME_DATA.pets.dogs.map(p => ({ ...p, desc: `${p.nameVi} dễ thương` })),
  ...GAME_DATA.pets.cats.map(p => ({ ...p, desc: `${p.nameVi} đáng yêu` }))
];

// Character appearance options
const CHARACTER_STYLES = {
  male: [
    { id: 'boy_1', name: 'Cool Boy', hair: '#7B4B36', skin: '#FEE5D9', hairStyle: 'short' },
    { id: 'boy_2', name: 'Smart Boy', hair: '#3A3A3C', skin: '#E8C5A8', hairStyle: 'medium' },
    { id: 'boy_3', name: 'Sporty Boy', hair: '#E05A47', skin: '#FDF0ED', hairStyle: 'short' },
  ],
  female: [
    { id: 'girl_1', name: 'Cute Girl', hair: '#E05A47', skin: '#FDF0ED', hairStyle: 'long' },
    { id: 'girl_2', name: 'Smart Girl', hair: '#7B4B36', skin: '#FEE5D9', hairStyle: 'pigtails' },
    { id: 'girl_3', name: 'Sporty Girl', hair: '#E6B89C', skin: '#FDF0ED', hairStyle: 'ponytail' },
  ]
};

// House colors
const HOUSE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#7B2D8B',
  '#F7971E', '#43E97B', '#FA709A', '#667EEA', '#FF8C42'
];

// Automatically tag genders for clothes and accessories items
const boyItemIds = [
  'top_yukata', 'top_vest_formal', 'bot_pants_school', 'bot_trouser_formal', 'bot_hakama',
  'acc_sword_toy', 'acc_shield_toy', 'acc_tie_formal', 'acc_guitar_toy'
];
const girlItemIds = [
  'top_dress_summer', 'top_dress_floral', 'top_kimono', 'top_dress_princess', 'top_blouse_lace',
  'top_tshirt_heart', 'top_dress_party', 'top_dress_gothic', 'top_kimono_sakura',
  'bot_skirt_plaid', 'bot_skirt_tutu', 'bot_leggings', 'bot_skirt_mini', 'bot_culottes',
  'acc_necklace', 'acc_hairpin', 'acc_hairband', 'acc_handbag', 'acc_bow', 'acc_backpack_kitty',
  'acc_crown_flower', 'acc_ears_cat', 'acc_ears_bunny', 'acc_wings_angel'
];

GAME_DATA.shops.clothes.items.forEach(item => {
  if (boyItemIds.includes(item.id)) item.gender = 'male';
  else if (girlItemIds.includes(item.id)) item.gender = 'female';
  else item.gender = 'all';
});

GAME_DATA.shops.accessories.items.forEach(item => {
  if (boyItemIds.includes(item.id)) item.gender = 'male';
  else if (girlItemIds.includes(item.id)) item.gender = 'female';
  else item.gender = 'all';
});
