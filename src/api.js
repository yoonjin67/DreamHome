// src/api.js
export async function fetchAptPrices(regionCode = '11500', dealYmd = '202403') {
    if (!SERVICE_KEY) {
      console.error('[api.js] SERVICE_KEY가 설정되지 않았습니다.');
      return [];
    }
  
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${SERVICE_KEY}&LAWD_CD=${regionCode}&DEAL_YMD=${dealYmd}`;
  
    try {
      const res = await fetch(url);
      const text = await res.text();
  
      console.log('[DEBUG] API 응답 원문:\n', text);
  
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "text/xml");
  
      const items = Array.from(xml.getElementsByTagName('item')).map((el, idx) => {
        const get = (tag) => el.getElementsByTagName(tag)[0]?.textContent?.trim() || '';
  
        const priceRaw = get('dealAmount');
        const price = priceRaw.replace(/,/g, '');
  
        const apt = {
            name: get('aptNm'),
            price: price || '가격없음',
            dong: get('umdNm'), // 동
            gu: get('estateAgentSggNm').replace('서울 ', '').trim(), // 구 ← 여기가 핵심
            year: get('dealYear'),
            month: get('dealMonth'),
            day: get('dealDay'),
            area: get('excluUseAr'),
            floor: get('floor'),
            jibun: get('jibun'),
            roadName: '',
            regionCode: regionCode,
          };
        console.log(`[DEBUG][${idx}]`, apt);
        return apt;
      });
  
      console.log('[DEBUG] 전체 거래 데이터 수:', items.length);
      return items;
    } catch (error) {
      console.error('[api.js] API 호출 오류:', error);
      return [];
    }
  }
  const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;