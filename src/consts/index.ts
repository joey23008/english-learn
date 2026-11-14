export * from './regex';
export * from './http';
export * from './message';
export * from './url';

export const SITE_TITLE = 'EN LEARN';
export const ORD_ASC = 'ASC'; // TODO 削除予定
export const ORD_DESC = 'DESC'; // TODO 削除予定
export const SORT_DIRECTIONS = [ORD_ASC, ORD_DESC] as const;
export const IDX_ORD_ASC = 0;
export const IDX_ORD_DESC = 1;
export const PAGE_TYPES = ['dashboard', 'frontend'] as const;
export const PAGE_TYPES_NM = ['ダッシュボード', 'フロントエンド'] as const;
export const IDX_DASH_PAGE = 0;
export const IDX_FRONT_PAGE = 1;
export const NAME_DASH_PAGE = 0;
export const PRIORITIES = [0, 1, 2] as const;
