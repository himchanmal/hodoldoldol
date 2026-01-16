-- expenses 테이블 생성
CREATE TABLE IF NOT EXISTS expenses (
  id BIGSERIAL PRIMARY KEY,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  type VARCHAR(20) NOT NULL CHECK (type IN ('both', 'hodol', 'doldol')),
  date DATE,
  amount DECIMAL(12, 2),
  major_category VARCHAR(100),
  minor_category VARCHAR(100),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_expenses_month ON expenses(month);
CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(type);
CREATE INDEX IF NOT EXISTS idx_expenses_month_type ON expenses(month, type);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- updated_at 자동 업데이트 트리거 (이미 함수가 있다면 스킵)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- expenses 테이블에 트리거 생성
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 코멘트 추가 (테이블 구조 이해를 위해)
COMMENT ON TABLE expenses IS '지출 내역 테이블';
COMMENT ON COLUMN expenses.month IS '월 (1-12)';
COMMENT ON COLUMN expenses.type IS '지출 타입: both(호돌이와 돌돌이), hodol(호돌이), doldol(돌돌이)';
COMMENT ON COLUMN expenses.date IS '지출 날짜';
COMMENT ON COLUMN expenses.amount IS '지출 금액';
COMMENT ON COLUMN expenses.major_category IS '대분류';
COMMENT ON COLUMN expenses.minor_category IS '소분류';
COMMENT ON COLUMN expenses.note IS '메모';
