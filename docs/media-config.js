(function configureOsSmMedia(global) {
  'use strict';

  const MEDIA_BASE_URL = 'https://media.84000.art';
  const MEDIA_RELEASE_ID = '20260720T075011Z-f18bc36f';

  const encodePathSegment = (segment) => {
    try {
      return encodeURIComponent(decodeURIComponent(segment));
    } catch (_) {
      return encodeURIComponent(segment);
    }
  };

  const makeMediaAssetUrl = (source) => {
    if (!source) return '';
    const value = String(source);
    if (/^(https?:)?\/\//i.test(value) || /^(data|blob):/i.test(value)) return value;

    const normalizedPath = value.replace(/^\.\//, '').replace(/^\/+/, '');
    const encodedPath = normalizedPath.split('/').map(encodePathSegment).join('/');
    const url = new URL(encodedPath, `${MEDIA_BASE_URL}/`);
    url.searchParams.set('v', MEDIA_RELEASE_ID);
    return url.toString();
  };

  global.OS_SM_MEDIA = Object.freeze({
    baseUrl: MEDIA_BASE_URL,
    releaseId: MEDIA_RELEASE_ID,
    makeUrl: makeMediaAssetUrl,
  });
  global.__APP_MEDIA_BASE_URL__ = MEDIA_BASE_URL;
  global.__APP_MEDIA_RELEASE_ID__ = MEDIA_RELEASE_ID;
  global.makeMediaAssetUrl = makeMediaAssetUrl;
})(window);
