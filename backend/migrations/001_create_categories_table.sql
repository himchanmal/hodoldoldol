-- categories 테이블 생성
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  main_category VARCHAR(100) NOT NULL,
  sub_category VARCHAR(100) NOT NULL,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 대분류와 소분류 조합이 고유하도록 제약 조건 추가
  UNIQUE(main_category, sub_category)
);

-- 인덱스 생성 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_categories_main_category ON categories(main_category);
CREATE INDEX IF NOT EXISTS idx_categories_sub_category ON categories(sub_category);
CREATE INDEX IF NOT EXISTS idx_categories_main_sub ON categories(main_category, sub_category);
CREATE INDEX IF NOT EXISTS idx_categories_count ON categories(count);

-- updated_at 자동 업데이트 트리거 함수 (이미 함수가 있다면 스킵)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- categories 테이블에 트리거 생성
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 코멘트 추가 (테이블 구조 이해를 위해)
COMMENT ON TABLE categories IS '카테고리 테이블 (대분류/소분류)';
COMMENT ON COLUMN categories.main_category IS '대분류 (예: 식비, 교통비, 공과금 등)';
COMMENT ON COLUMN categories.sub_category IS '소분류 (예: 오프라인, 온라인, 커피 등)';
COMMENT ON COLUMN categories.count IS '해당 카테고리를 사용한 지출 내역 개수';
COMMENT ON COLUMN categories.created_at IS '생성 시간';
COMMENT ON COLUMN categories.updated_at IS '수정 시간 (자동 업데이트)';
