-- expenses 테이블 변경 시 categories 테이블의 count 자동 업데이트

-- 1. 소분류별 count 업데이트 함수
CREATE OR REPLACE FUNCTION update_category_count()
RETURNS TRIGGER AS $$
BEGIN
  -- INSERT인 경우
  IF TG_OP = 'INSERT' THEN
    -- 새 카테고리가 있는 경우 count 증가
    IF NEW.major_category IS NOT NULL AND NEW.minor_category IS NOT NULL THEN
      UPDATE categories
      SET count = count + 1
      WHERE main_category = NEW.major_category
        AND sub_category = NEW.minor_category;
    END IF;
    RETURN NEW;
  END IF;
  
  -- UPDATE인 경우
  IF TG_OP = 'UPDATE' THEN
    -- 카테고리가 변경된 경우에만 처리
    IF (OLD.major_category IS DISTINCT FROM NEW.major_category) OR 
       (OLD.minor_category IS DISTINCT FROM NEW.minor_category) THEN
      
      -- 이전 카테고리의 count 감소
      IF OLD.major_category IS NOT NULL AND OLD.minor_category IS NOT NULL THEN
        UPDATE categories
        SET count = GREATEST(0, count - 1)
        WHERE main_category = OLD.major_category
          AND sub_category = OLD.minor_category;
      END IF;
      
      -- 새 카테고리의 count 증가
      IF NEW.major_category IS NOT NULL AND NEW.minor_category IS NOT NULL THEN
        UPDATE categories
        SET count = count + 1
        WHERE main_category = NEW.major_category
          AND sub_category = NEW.minor_category;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  
  -- DELETE인 경우
  IF TG_OP = 'DELETE' THEN
    IF OLD.major_category IS NOT NULL AND OLD.minor_category IS NOT NULL THEN
      UPDATE categories
      SET count = GREATEST(0, count - 1)
      WHERE main_category = OLD.major_category
        AND sub_category = OLD.minor_category;
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 2. 트리거 생성
DROP TRIGGER IF EXISTS trigger_update_category_count ON expenses;
CREATE TRIGGER trigger_update_category_count
  AFTER INSERT OR UPDATE OR DELETE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_category_count();

-- 3. 기존 데이터로 count 초기화 함수
CREATE OR REPLACE FUNCTION sync_category_counts()
RETURNS void AS $$
BEGIN
  -- 모든 카테고리의 count를 0으로 초기화
  UPDATE categories SET count = 0;
  
  -- expenses 테이블에서 실제 사용된 카테고리별 count 계산
  UPDATE categories c
  SET count = (
    SELECT COUNT(*)
    FROM expenses e
    WHERE e.major_category = c.main_category
      AND e.minor_category = c.sub_category
  );
END;
$$ LANGUAGE plpgsql;

-- 4. 초기화 실행 (기존 데이터가 있다면)
-- SELECT sync_category_counts();
