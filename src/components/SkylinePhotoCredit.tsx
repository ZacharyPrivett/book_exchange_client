/**
 * Small, unobtrusive attribution caption for the Charlotte skyline backdrop
 * photo (CC BY 2.0 - Nan Palmero / Wikimedia Commons). Required by the
 * license; keep this alongside any use of charlotte-skyline.jpg.
 */
export const SkylinePhotoCredit = ({ fixed = false }: { fixed?: boolean }) => (
  <a
    href="https://commons.wikimedia.org/wiki/File:Charlotte_night_skyline_2016.jpg"
    target="_blank"
    rel="noreferrer"
    className={fixed ? 'qc-photo-credit qc-photo-credit-fixed' : 'qc-photo-credit'}
  >
    Skyline photo: Nan Palmero (CC BY 2.0)
  </a>
);
