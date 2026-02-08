const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db;

function initDatabase() {
  db = new Database(DB_PATH);

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Check if tables exist
  const tableExists = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='admin_users'"
  ).get();

  if (!tableExists) {
    console.log('Initializing database schema...');
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    db.exec(schema);
    console.log('Database schema initialized successfully.');
  } else {
    console.log('Database already initialized.');
    // Run migrations for new tables
    const siteImagesExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='site_images'").get();
    if (!siteImagesExists) {
      console.log('Migrating: adding site_images and results tables...');
      db.exec(`
        CREATE TABLE IF NOT EXISTS site_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slot TEXT UNIQUE NOT NULL,
          label TEXT NOT NULL,
          image_url TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          treatment_name TEXT NOT NULL,
          before_image TEXT,
          after_image TEXT,
          display_order INTEGER DEFAULT 0,
          is_visible INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('hero-bg', '히어로 배경', '/images/hero-bg.jpg');
        INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('about-clinic', '소개 섹션', '/images/about-clinic.jpg');
        INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('treatment-lifting', '시술카드 - 리프팅', '/images/treatment-lifting.jpg');
        INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('treatment-skincare', '시술카드 - 피부관리', '/images/treatment-skincare.jpg');
        INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('treatment-injection', '시술카드 - 주사시술', '/images/treatment-injection.jpg');
        INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('treatment-body', '시술카드 - 체형관리', '/images/treatment-body.jpg');
        INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('column-editorial', '칼럼 에디토리얼', '/images/column-editorial.jpg');
        INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('page-hero-bg', '서브페이지 히어로', '/images/page-hero-bg.jpg');
        INSERT OR IGNORE INTO site_images (slot, label, image_url) VALUES ('clinic-interior', '클리닉 인테리어', '/images/clinic-interior.jpg');
      `);
      console.log('Migration complete.');
    }
    // Migration 2: treatment_images table
    const treatImgExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='treatment_images'").get();
    if (!treatImgExists) {
      console.log('Migrating: adding treatment_images table...');
      db.exec(`
        CREATE TABLE IF NOT EXISTS treatment_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          page TEXT NOT NULL,
          slot TEXT NOT NULL,
          label TEXT NOT NULL,
          image_url TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(page, slot)
        );
      `);
      // Seed default slots for each treatment page
      const pages = [
        { page: 'lifting', label: '리프팅', slots: [
          { slot: 'category-ulthera', label: '카테고리 - 울쎄라' },
          { slot: 'category-thermage', label: '카테고리 - 써마지' },
          { slot: 'category-hifu', label: '카테고리 - HIFU' },
          { slot: 'category-softwave', label: '카테고리 - 소프트웨이브' }
        ]},
        { page: 'lifting/ulthera', label: '울쎄라', slots: [
          { slot: 'equipment', label: '장비 이미지' }
        ]},
        { page: 'lifting/thermage', label: '써마지', slots: [
          { slot: 'equipment', label: '장비 이미지' }
        ]},
        { page: 'lifting/hifu', label: 'HIFU', slots: [
          { slot: 'equipment', label: '장비 이미지' }
        ]},
        { page: 'lifting/softwave', label: '소프트웨이브', slots: [
          { slot: 'equipment', label: '장비 이미지' }
        ]},
        { page: 'skincare/bbl', label: 'BBL', slots: [
          { slot: 'equipment', label: '장비 이미지' }
        ]},
        { page: 'skincare/laser-toning', label: '레이저토닝', slots: [
          { slot: 'equipment', label: '장비 이미지' }
        ]},
        { page: 'skincare/skin-booster', label: '스킨부스터', slots: [
          { slot: 'equipment', label: '장비 이미지' }
        ]},
        { page: 'injection/botox', label: '보톡스', slots: [
          { slot: 'equipment', label: '장비 이미지' }
        ]},
        { page: 'injection/filler', label: '필러', slots: [
          { slot: 'equipment', label: '장비 이미지' }
        ]},
        { page: 'injection/mulgwang', label: '물광주사', slots: [
          { slot: 'equipment', label: '장비 이미지' }
        ]},
        { page: 'body/body-contouring', label: '바디 컨투어링', slots: [
          { slot: 'equipment-1', label: '장비 이미지 1' },
          { slot: 'equipment-2', label: '장비 이미지 2' },
          { slot: 'equipment-3', label: '장비 이미지 3' }
        ]},
        { page: 'body/body-lifting', label: '바디 리프팅', slots: [
          { slot: 'equipment-1', label: '장비 이미지 1' },
          { slot: 'equipment-2', label: '장비 이미지 2' },
          { slot: 'equipment-3', label: '장비 이미지 3' }
        ]}
      ];
      const insertStmt = db.prepare('INSERT OR IGNORE INTO treatment_images (page, slot, label) VALUES (?, ?, ?)');
      pages.forEach(p => {
        p.slots.forEach(s => {
          insertStmt.run(p.page, s.slot, p.label + ' - ' + s.label);
        });
      });
      console.log('Treatment images migration complete.');
    }
    // Migration 3: treatment_pages table (editable content)
    const treatPagesExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='treatment_pages'").get();
    if (!treatPagesExists) {
      console.log('Migrating: adding treatment_pages table...');
      db.exec(`
        CREATE TABLE IF NOT EXISTS treatment_pages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          page TEXT UNIQUE NOT NULL,
          page_label TEXT NOT NULL,
          content_json TEXT DEFAULT '{}',
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      const pages = [
        ['lifting', '리프팅 카테고리'],
        ['lifting/ulthera', '울쎄라'],
        ['lifting/thermage', '써마지'],
        ['lifting/hifu', 'HIFU'],
        ['lifting/softwave', '소프트웨이브'],
        ['skincare', '피부관리 카테고리'],
        ['skincare/bbl', 'BBL'],
        ['skincare/laser-toning', '레이저토닝'],
        ['skincare/skin-booster', '스킨부스터'],
        ['injection', '주사시술 카테고리'],
        ['injection/botox', '보톡스'],
        ['injection/filler', '필러'],
        ['injection/mulgwang', '물광주사'],
        ['body', '체형관리 카테고리'],
        ['body/body-contouring', '바디 컨투어링'],
        ['body/body-lifting', '바디 리프팅']
      ];
      const ins = db.prepare('INSERT OR IGNORE INTO treatment_pages (page, page_label) VALUES (?, ?)');
      pages.forEach(p => ins.run(p[0], p[1]));
      console.log('Treatment pages migration complete.');
    }
    // Migration 4: site_settings table (theme color etc.)
    const settingsExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='site_settings'").get();
    if (!settingsExists) {
      console.log('Migrating: adding site_settings table...');
      db.exec(`
        CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          value TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        INSERT OR IGNORE INTO site_settings (key, value) VALUES ('theme_primary', '#5C2A2E');
        INSERT OR IGNORE INTO site_settings (key, value) VALUES ('theme_primary_light', '#753840');
        INSERT OR IGNORE INTO site_settings (key, value) VALUES ('theme_primary_dark', '#3D1C1F');
      `);
      console.log('Site settings migration complete.');
    }
    // Migration 5: add media_type to site_images
    try {
      db.prepare("SELECT media_type FROM site_images LIMIT 1").get();
    } catch(e) {
      console.log('Migrating: adding media_type column to site_images...');
      db.exec("ALTER TABLE site_images ADD COLUMN media_type TEXT DEFAULT 'image'");
      console.log('media_type migration complete.');
    }

    // Migration 6: page_content table for CMS
    const pageContentExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='page_content'").get();
    if (!pageContentExists) {
      console.log('Migrating: adding page_content table for CMS...');
      db.exec(`
        CREATE TABLE IF NOT EXISTS page_content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          page_slug TEXT NOT NULL,
          section_type TEXT NOT NULL,
          section_key TEXT NOT NULL,
          content_ko TEXT,
          content_ja TEXT,
          content_zh_cn TEXT,
          content_zh_tw TEXT,
          display_order INTEGER DEFAULT 0,
          is_visible INTEGER DEFAULT 1,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(page_slug, section_key)
        );
        CREATE INDEX IF NOT EXISTS idx_page_content_slug ON page_content(page_slug);
        CREATE INDEX IF NOT EXISTS idx_page_content_order ON page_content(page_slug, display_order);
      `);

      // Seed initial homepage content
      const homeSections = [
        {
          page_slug: 'home',
          section_type: 'hero',
          section_key: 'home_hero',
          display_order: 1,
          content_ko: JSON.stringify({
            label: "TONE'S CLINIC MYEONGDONG",
            title_en: "Lifting Life",
            title_kr: "프리미엄 신뢰의 경험, 맞춤 시술의 완성",
            description: "명동의 프리미엄 피부 전문, TONE'S CLINIC입니다<br>당신만을 위해 설계된 1:1 맞춤 안티에이징"
          }),
          content_ja: JSON.stringify({
            label: "TONE'S CLINIC MYEONGDONG",
            title_en: "Lifting Life",
            title_kr: "プレミアムな信頼の経験、オーダーメイド施術の完成",
            description: "明洞のプレミアム皮膚専門、TONE'S CLINICです<br>あなただけのために設計された1:1オーダーメイドアンチエイジング"
          }),
          content_zh_cn: JSON.stringify({
            label: "TONE'S CLINIC MYEONGDONG",
            title_en: "Lifting Life",
            title_kr: "高端信赖体验，定制治疗完成",
            description: "明洞高端皮肤专科，TONE'S CLINIC<br>专为您设计的1:1定制抗衰老"
          }),
          content_zh_tw: JSON.stringify({
            label: "TONE'S CLINIC MYEONGDONG",
            title_en: "Lifting Life",
            title_kr: "頂級信賴體驗，訂製療程完成",
            description: "明洞頂級皮膚專科，TONE'S CLINIC<br>專為您設計的1:1訂製抗衰老"
          })
        },
        {
          page_slug: 'home',
          section_type: 'about',
          section_key: 'home_about',
          display_order: 2,
          content_ko: JSON.stringify({
            label: "ABOUT TONE'S MYEONGDONG",
            title: "보이지 않는 것까지<br><em>들여다봅니다</em>",
            description: ["좋은 시술은 눈에 띄지 않습니다. 자연스러움의 완성은 정밀한 진단에서 시작됩니다.", "TONE'S 명동점은 한 분 한 분의 피부결, 골격, 노화 패턴까지 세밀하게 읽어내어 시술을 설계합니다."],
            points: [
              { num: "01", title: "오직 한 사람을 위한 시간", desc: "1:1 전담 시스템, 개인별 맞춤 설계" },
              { num: "02", title: "결과로 증명하는 장비", desc: "울쎄라·써마지 정품 인증 클리닉" },
              { num: "03", title: "온전히 나만의 공간", desc: "독립 시술실, 프라이빗 동선" }
            ],
            button_text: "자세히 보기",
            button_link: "about.html"
          }),
          content_ja: JSON.stringify({
            label: "ABOUT TONE'S MYEONGDONG",
            title: "見えないものまで<br><em>見つめます</em>",
            description: ["良い施術は目立ちません。自然な仕上がりは精密な診断から始まります。", "TONE'S明洞店は、お一人おひとりの肌質、骨格、老化パターンまで細かく分析し、施術を設計します。"],
            points: [
              { num: "01", title: "ただ一人のための時間", desc: "1:1専任システム、個人別オーダーメイド設計" },
              { num: "02", title: "結果で証明する装備", desc: "ウルセラ・サーマジ正規認証クリニック" },
              { num: "03", title: "完全にプライベートな空間", desc: "独立施術室、プライベート動線" }
            ],
            button_text: "詳しく見る",
            button_link: "about.html"
          }),
          content_zh_cn: JSON.stringify({
            label: "ABOUT TONE'S MYEONGDONG",
            title: "看透<br><em>看不见的</em>",
            description: ["好的治疗不会被察觉。自然的完成始于精密的诊断。", "TONE'S明洞店细致分析每位客人的肤质、骨骼、老化模式，设计专属疗程。"],
            points: [
              { num: "01", title: "只为一人的时间", desc: "1:1专属系统，个人定制设计" },
              { num: "02", title: "用结果证明的设备", desc: "Ulthera·Thermage正品认证诊所" },
              { num: "03", title: "完全私密的空间", desc: "独立治疗室，私密动线" }
            ],
            button_text: "详细了解",
            button_link: "about.html"
          }),
          content_zh_tw: JSON.stringify({
            label: "ABOUT TONE'S MYEONGDONG",
            title: "看透<br><em>看不見的</em>",
            description: ["好的療程不會被察覺。自然的完成始於精密的診斷。", "TONE'S明洞店細緻分析每位客人的膚質、骨骼、老化模式，設計專屬療程。"],
            points: [
              { num: "01", title: "只為一人的時間", desc: "1:1專屬系統，個人訂製設計" },
              { num: "02", title: "用結果證明的設備", desc: "Ulthera·Thermage正品認證診所" },
              { num: "03", title: "完全私密的空間", desc: "獨立治療室，私密動線" }
            ],
            button_text: "詳細了解",
            button_link: "about.html"
          })
        },
        {
          page_slug: 'home',
          section_type: 'treatments',
          section_key: 'home_treatments',
          display_order: 3,
          content_ko: JSON.stringify({
            label: "TREATMENTS",
            title: "피부가 원하는 것을<br><em>정확히 찾아냅니다</em>",
            subtitle: "각각의 시술에는 이유가 있습니다<br>당신의 피부에 가장 적합한 답을 제안합니다",
            items: [
              { num: "01", title: "리프팅", en: "Lifting", desc: "처진 윤곽선을 되돌리고, 피부 안쪽부터 탄력을 끌어올립니다.", link: "treatments/lifting.html" },
              { num: "02", title: "피부관리", en: "Skin Care", desc: "피부결의 밀도를 높이고, 안에서 빛나는 투명함을 만듭니다.", link: "treatments/skincare.html" },
              { num: "03", title: "주사시술", en: "Injection", desc: "미세한 양의 차이가 인상을 바꿉니다. 자연스러움이 기준입니다.", link: "treatments/injection.html" },
              { num: "04", title: "체형관리", en: "Body Care", desc: "균형 잡힌 바디라인을 위한 체계적 관리. 자신감을 되찾습니다.", link: "treatments/body.html" }
            ]
          }),
          content_ja: JSON.stringify({
            label: "TREATMENTS",
            title: "肌が求めるものを<br><em>正確に見つけます</em>",
            subtitle: "それぞれの施術には理由があります<br>あなたの肌に最適な答えをご提案します",
            items: [
              { num: "01", title: "リフティング", en: "Lifting", desc: "たるんだ輪郭を取り戻し、肌の奥からハリを引き上げます。", link: "treatments/lifting.html" },
              { num: "02", title: "スキンケア", en: "Skin Care", desc: "肌のキメを整え、内側から輝く透明感を作ります。", link: "treatments/skincare.html" },
              { num: "03", title: "注射施術", en: "Injection", desc: "微量の違いが印象を変えます。自然さが基準です。", link: "treatments/injection.html" },
              { num: "04", title: "ボディケア", en: "Body Care", desc: "バランスの取れたボディラインのための体系的な管理。自信を取り戻します。", link: "treatments/body.html" }
            ]
          }),
          content_zh_cn: JSON.stringify({
            label: "TREATMENTS",
            title: "精准找到<br><em>肌肤所需</em>",
            subtitle: "每种治疗都有其原因<br>为您的肌肤提供最合适的方案",
            items: [
              { num: "01", title: "提升", en: "Lifting", desc: "恢复下垂轮廓，从肌肤深层提升弹性。", link: "treatments/lifting.html" },
              { num: "02", title: "皮肤管理", en: "Skin Care", desc: "提高肌肤纹理密度，打造由内而外的透明感。", link: "treatments/skincare.html" },
              { num: "03", title: "注射治疗", en: "Injection", desc: "微量差异改变印象。自然是标准。", link: "treatments/injection.html" },
              { num: "04", title: "体型管理", en: "Body Care", desc: "系统管理打造均衡身材线条。重拾自信。", link: "treatments/body.html" }
            ]
          }),
          content_zh_tw: JSON.stringify({
            label: "TREATMENTS",
            title: "精準找到<br><em>肌膚所需</em>",
            subtitle: "每種療程都有其原因<br>為您的肌膚提供最合適的方案",
            items: [
              { num: "01", title: "提升", en: "Lifting", desc: "恢復下垂輪廓，從肌膚深層提升彈性。", link: "treatments/lifting.html" },
              { num: "02", title: "皮膚管理", en: "Skin Care", desc: "提高肌膚紋理密度，打造由內而外的透明感。", link: "treatments/skincare.html" },
              { num: "03", title: "注射治療", en: "Injection", desc: "微量差異改變印象。自然是標準。", link: "treatments/injection.html" },
              { num: "04", title: "體型管理", en: "Body Care", desc: "系統管理打造均衡身材線條。重拾自信。", link: "treatments/body.html" }
            ]
          })
        },
        {
          page_slug: 'home',
          section_type: 'trust',
          section_key: 'home_trust',
          display_order: 4,
          content_ko: JSON.stringify({
            label: "WHY TONE'S MYEONGDONG",
            title: "자신감 넘치는 이유?<br><em>이 3가지가 다르기 때문입니다</em>",
            items: [
              { number: "15", unit: "억+", label: "프리미엄 장비 투자", desc: "울쎄라·써마지 정품 인증, 더 좋은 결과를 위해 고가 장비에 아낌없이 투자합니다." },
              { number: "1:1", unit: "", label: "전담 맞춤 시술", desc: "모든 시술은 원장 상담 후 진행. 개인별 피부 상태에 맞는 맞춤 프로토콜을 설계합니다." },
              { number: "100", unit: "%", label: "프라이빗 공간", desc: "호텔급 독립 시술실과 프라이빗 동선. 시술 전후 온전히 편안한 공간을 제공합니다." }
            ]
          }),
          content_ja: JSON.stringify({
            label: "WHY TONE'S MYEONGDONG",
            title: "自信に満ちた理由？<br><em>この3つが違うからです</em>",
            items: [
              { number: "15", unit: "億+", label: "プレミアム装備投資", desc: "ウルセラ・サーマジ正規認証、より良い結果のために高額装備に惜しみなく投資。" },
              { number: "1:1", unit: "", label: "専任オーダーメイド施術", desc: "全ての施術は院長相談後に進行。個人別の肌状態に合わせたオーダーメイドプロトコルを設計。" },
              { number: "100", unit: "%", label: "プライベート空間", desc: "ホテル級独立施術室とプライベート動線。施術前後、完全に快適な空間を提供。" }
            ]
          }),
          content_zh_cn: JSON.stringify({
            label: "WHY TONE'S MYEONGDONG",
            title: "充满自信的原因？<br><em>因为这3点不同</em>",
            items: [
              { number: "15", unit: "亿+", label: "高端设备投资", desc: "Ulthera·Thermage正品认证，为更好的效果不惜投资高端设备。" },
              { number: "1:1", unit: "", label: "专属定制治疗", desc: "所有治疗均在院长咨询后进行。设计符合个人肤质的定制方案。" },
              { number: "100", unit: "%", label: "私密空间", desc: "酒店级独立治疗室和私密动线。治疗前后提供完全舒适的空间。" }
            ]
          }),
          content_zh_tw: JSON.stringify({
            label: "WHY TONE'S MYEONGDONG",
            title: "充滿自信的原因？<br><em>因為這3點不同</em>",
            items: [
              { number: "15", unit: "億+", label: "頂級設備投資", desc: "Ulthera·Thermage正品認證，為更好的效果不惜投資頂級設備。" },
              { number: "1:1", unit: "", label: "專屬訂製療程", desc: "所有療程均在院長諮詢後進行。設計符合個人膚質的訂製方案。" },
              { number: "100", unit: "%", label: "私密空間", desc: "飯店級獨立治療室和私密動線。療程前後提供完全舒適的空間。" }
            ]
          })
        },
        {
          page_slug: 'home',
          section_type: 'results',
          section_key: 'home_results',
          display_order: 5,
          content_ko: JSON.stringify({
            label: "BEFORE & AFTER",
            title: "보고 <em>결정하세요</em>",
            note: "※ 촬영 동의 하에 게시되었으며, 별도의 보정이 들어가지 않은 사진입니다.<br>※ 개인에 따라 시술 효과가 다를 수 있으며, 부작용이 발생할 수 있습니다.",
            button_text: "전후사진 더보기"
          }),
          content_ja: JSON.stringify({
            label: "BEFORE & AFTER",
            title: "見て<em>決めてください</em>",
            note: "※撮影同意のもと掲載しており、加工なしの写真です。<br>※個人により施術効果が異なる場合があり、副作用が発生する可能性があります。",
            button_text: "もっと見る"
          }),
          content_zh_cn: JSON.stringify({
            label: "BEFORE & AFTER",
            title: "看后<em>决定</em>",
            note: "※经拍摄同意后发布，未经任何修图处理。<br>※因个人差异治疗效果可能不同，可能产生副作用。",
            button_text: "查看更多"
          }),
          content_zh_tw: JSON.stringify({
            label: "BEFORE & AFTER",
            title: "看後<em>決定</em>",
            note: "※經拍攝同意後發布，未經任何修圖處理。<br>※因個人差異療程效果可能不同，可能產生副作用。",
            button_text: "查看更多"
          })
        },
        {
          page_slug: 'home',
          section_type: 'column',
          section_key: 'home_column',
          display_order: 6,
          content_ko: JSON.stringify({
            label: "DOCTOR'S COLUMN",
            title: "피부에 대해<br><em>솔직하게</em>",
            button_text: "칼럼 전체보기"
          }),
          content_ja: JSON.stringify({
            label: "DOCTOR'S COLUMN",
            title: "肌について<br><em>正直に</em>",
            button_text: "コラム一覧"
          }),
          content_zh_cn: JSON.stringify({
            label: "DOCTOR'S COLUMN",
            title: "关于皮肤<br><em>坦诚相告</em>",
            button_text: "查看全部专栏"
          }),
          content_zh_tw: JSON.stringify({
            label: "DOCTOR'S COLUMN",
            title: "關於皮膚<br><em>坦誠相告</em>",
            button_text: "查看全部專欄"
          })
        },
        {
          page_slug: 'home',
          section_type: 'promo',
          section_key: 'home_promo',
          display_order: 7,
          content_ko: JSON.stringify({
            label: "PROMOTION",
            title: "지금, <em>특별한 기회</em>",
            items: [
              { badge: "NEW", category: "리프팅", title: "울쎄라 + 써마지<br>콤비 리프팅", desc: "두 가지 에너지를 레이어링하여 시너지 극대화", cta: "상담 예약", link: "reservation.html" },
              { badge: "", category: "피부관리", title: "첫 방문 고객<br>스킨 컨설팅", desc: "피부 진단부터 맞춤 시술 설계까지 1:1 상담", cta: "상담 예약", link: "reservation.html" },
              { badge: "", category: "주사시술", title: "보톡스 + 물광<br>패키지", desc: "자연스러운 인상 개선과 피부 광채를 한 번에", cta: "상담 예약", link: "reservation.html" }
            ]
          }),
          content_ja: JSON.stringify({
            label: "PROMOTION",
            title: "今、<em>特別な機会</em>",
            items: [
              { badge: "NEW", category: "リフティング", title: "ウルセラ + サーマジ<br>コンビリフティング", desc: "2つのエネルギーをレイヤリングしてシナジー最大化", cta: "相談予約", link: "reservation.html" },
              { badge: "", category: "スキンケア", title: "初回来院のお客様<br>スキンコンサルティング", desc: "肌診断からオーダーメイド施術設計まで1:1相談", cta: "相談予約", link: "reservation.html" },
              { badge: "", category: "注射施術", title: "ボトックス + 水光<br>パッケージ", desc: "自然な印象改善と肌のツヤを一度に", cta: "相談予約", link: "reservation.html" }
            ]
          }),
          content_zh_cn: JSON.stringify({
            label: "PROMOTION",
            title: "现在，<em>特别机会</em>",
            items: [
              { badge: "NEW", category: "提升", title: "Ulthera + Thermage<br>组合提升", desc: "两种能量叠加实现协同效应最大化", cta: "预约咨询", link: "reservation.html" },
              { badge: "", category: "皮肤管理", title: "首次来访客人<br>皮肤咨询", desc: "从皮肤诊断到定制治疗设计的1:1咨询", cta: "预约咨询", link: "reservation.html" },
              { badge: "", category: "注射治疗", title: "肉毒素 + 水光<br>套餐", desc: "自然改善印象和肌肤光泽一次完成", cta: "预约咨询", link: "reservation.html" }
            ]
          }),
          content_zh_tw: JSON.stringify({
            label: "PROMOTION",
            title: "現在，<em>特別機會</em>",
            items: [
              { badge: "NEW", category: "提升", title: "Ulthera + Thermage<br>組合提升", desc: "兩種能量疊加實現協同效應最大化", cta: "預約諮詢", link: "reservation.html" },
              { badge: "", category: "皮膚管理", title: "首次來訪客人<br>皮膚諮詢", desc: "從皮膚診斷到訂製療程設計的1:1諮詢", cta: "預約諮詢", link: "reservation.html" },
              { badge: "", category: "注射療程", title: "肉毒素 + 水光<br>套餐", desc: "自然改善印象和肌膚光澤一次完成", cta: "預約諮詢", link: "reservation.html" }
            ]
          })
        },
        {
          page_slug: 'home',
          section_type: 'location',
          section_key: 'home_location',
          display_order: 8,
          content_ko: JSON.stringify({
            label: "LOCATION",
            title: "오시는 길",
            address: "서울특별시 중구 명동길 [상세주소]",
            subway: "명동역 7번 출구 도보 3분",
            phone: "02-XXXX-XXXX",
            hours: [
              { day: "월 - 목", time: "10:00 ~ 19:00" },
              { day: "금요일", time: "10:00 ~ 21:00", badge: "야간진료" },
              { day: "토요일", time: "10:00 ~ 16:00" },
              { day: "일·공휴일", time: "휴무" }
            ],
            notice: "※ 100% 예약제로 운영됩니다.",
            button_text: "온라인 예약하기"
          }),
          content_ja: JSON.stringify({
            label: "LOCATION",
            title: "アクセス",
            address: "ソウル特別市中区明洞ギル [詳細住所]",
            subway: "明洞駅7番出口 徒歩3分",
            phone: "02-XXXX-XXXX",
            hours: [
              { day: "月 - 木", time: "10:00 ~ 19:00" },
              { day: "金曜日", time: "10:00 ~ 21:00", badge: "夜間診療" },
              { day: "土曜日", time: "10:00 ~ 16:00" },
              { day: "日・祝日", time: "休診" }
            ],
            notice: "※ 100%予約制で運営しています。",
            button_text: "オンライン予約"
          }),
          content_zh_cn: JSON.stringify({
            label: "LOCATION",
            title: "交通指南",
            address: "首尔特别市中区明洞路 [详细地址]",
            subway: "明洞站7号出口 步行3分钟",
            phone: "02-XXXX-XXXX",
            hours: [
              { day: "周一 - 周四", time: "10:00 ~ 19:00" },
              { day: "周五", time: "10:00 ~ 21:00", badge: "夜间诊疗" },
              { day: "周六", time: "10:00 ~ 16:00" },
              { day: "周日·节假日", time: "休息" }
            ],
            notice: "※ 100%预约制运营。",
            button_text: "在线预约"
          }),
          content_zh_tw: JSON.stringify({
            label: "LOCATION",
            title: "交通指南",
            address: "首爾特別市中區明洞路 [詳細地址]",
            subway: "明洞站7號出口 步行3分鐘",
            phone: "02-XXXX-XXXX",
            hours: [
              { day: "週一 - 週四", time: "10:00 ~ 19:00" },
              { day: "週五", time: "10:00 ~ 21:00", badge: "夜間診療" },
              { day: "週六", time: "10:00 ~ 16:00" },
              { day: "週日·節假日", time: "休息" }
            ],
            notice: "※ 100%預約制運營。",
            button_text: "線上預約"
          })
        }
      ];

      const insertStmt = db.prepare(`
        INSERT INTO page_content (page_slug, section_type, section_key, content_ko, content_ja, content_zh_cn, content_zh_tw, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      homeSections.forEach(s => {
        insertStmt.run(s.page_slug, s.section_type, s.section_key, s.content_ko, s.content_ja || null, s.content_zh_cn || null, s.content_zh_tw || null, s.display_order);
      });

      console.log('Page content migration complete.');
    }
  }

  return db;
}

function getDb() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

module.exports = { initDatabase, getDb };
