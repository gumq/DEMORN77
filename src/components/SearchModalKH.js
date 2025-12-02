import { convertVi } from '@utils';

/**
 * SearchModal: tìm trong `data` (array) theo `value` (string)
 * chỉ kiểm tra các trường: TaxCode, SearchName, FullAddress, Phone, Name, ShortName, CustomerCode
 */
const SearchModalKH = (data, value) => {
  if (!Array.isArray(data) || !value) return [];

  const q = String(value).toLowerCase();
  const qNorm = convertVi(q);

  // các trường cho phép search (case-insensitive, normalized)
  const FIELDS = [
    'TaxCode',
    'SearchName',
    'FullAddress',
    'Phone',
    'Name',
    'ShortName',
    'CustomerCode',
  ];

  return data.filter(item => {
    if (!item || typeof item !== 'object') return false;

    for (let i = 0; i < FIELDS.length; i++) {
      const field = FIELDS[i];
      let val = item[field];

      if (val === undefined || val === null) continue;

      // nếu là số thì chuyển sang string
      if (typeof val !== 'string') {
        try {
          val = String(val);
        } catch (e) {
          continue;
        }
      }

      const lowerVal = val.toLowerCase();
      const normVal = convertVi(lowerVal);

      if (normVal.includes(qNorm) || lowerVal.includes(q)) {
        return true;
      }
    }

    return false;
  });
};

export default SearchModalKH;
