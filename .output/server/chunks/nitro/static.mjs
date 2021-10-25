import { createError } from 'h3';
import { withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const assets = {
  "/_nuxt/Header-7cca3969.mjs": {
    "type": "application/javascript",
    "etag": "\"4a5-UsQN9h3gQq7/yzkQ5M3U+84d954\"",
    "mtime": "2021-10-25T06:57:00.852Z",
    "path": "../public/_nuxt/Header-7cca3969.mjs"
  },
  "/_nuxt/IncludedContent-1e736c0c.mjs": {
    "type": "application/javascript",
    "etag": "\"957-Z0MwYTKqZPLmNugHH35Z0fVEYgc\"",
    "mtime": "2021-10-25T06:57:00.852Z",
    "path": "../public/_nuxt/IncludedContent-1e736c0c.mjs"
  },
  "/_nuxt/IncludedContentItem-24476813.mjs": {
    "type": "application/javascript",
    "etag": "\"4cb-UORlhpdMFoml/SZZ9RnWoxA2/y0\"",
    "mtime": "2021-10-25T06:57:00.851Z",
    "path": "../public/_nuxt/IncludedContentItem-24476813.mjs"
  },
  "/_nuxt/Info-71b31c5e.mjs": {
    "type": "application/javascript",
    "etag": "\"dd5-uuR3UrxxhpcBTvM0vhRwqT8190E\"",
    "mtime": "2021-10-25T06:57:00.851Z",
    "path": "../public/_nuxt/Info-71b31c5e.mjs"
  },
  "/_nuxt/Intro-7764e795.mjs": {
    "type": "application/javascript",
    "etag": "\"2e5-Bq/hJ/0Hg1hb3ulx+pTh9UwX4fc\"",
    "mtime": "2021-10-25T06:57:00.851Z",
    "path": "../public/_nuxt/Intro-7764e795.mjs"
  },
  "/_nuxt/Overlay-9241084a.mjs": {
    "type": "application/javascript",
    "etag": "\"ae5-0mrM1HQ32hHcPTUUiBeYGT9GPHk\"",
    "mtime": "2021-10-25T06:57:00.851Z",
    "path": "../public/_nuxt/Overlay-9241084a.mjs"
  },
  "/_nuxt/ScreenItem-0090b8f6.mjs": {
    "type": "application/javascript",
    "etag": "\"5dd-2QgSZj/JYD/dwNzrh3waDFSleDQ\"",
    "mtime": "2021-10-25T06:57:00.850Z",
    "path": "../public/_nuxt/ScreenItem-0090b8f6.mjs"
  },
  "/_nuxt/ScreenItem-bbc633e5.mjs": {
    "type": "application/javascript",
    "etag": "\"889-t8M+o7JOurSaYLeejjSZy1OEDkk\"",
    "mtime": "2021-10-25T06:57:00.850Z",
    "path": "../public/_nuxt/ScreenItem-bbc633e5.mjs"
  },
  "/_nuxt/ScreenList-0b7e2c85.mjs": {
    "type": "application/javascript",
    "etag": "\"22b-ywg1qfx4AMO77+Tjq2LuJk8WT8Y\"",
    "mtime": "2021-10-25T06:57:00.850Z",
    "path": "../public/_nuxt/ScreenList-0b7e2c85.mjs"
  },
  "/_nuxt/ScreenList-6c5aa84c.mjs": {
    "type": "application/javascript",
    "etag": "\"2b0-KiO77ie/7JRyfQsvD5wH6foifLs\"",
    "mtime": "2021-10-25T06:57:00.849Z",
    "path": "../public/_nuxt/ScreenList-6c5aa84c.mjs"
  },
  "/_nuxt/Search-b5e9e8df.mjs": {
    "type": "application/javascript",
    "etag": "\"313-3TK2BHiUuYp2O6MVcHXmQu/2ia4\"",
    "mtime": "2021-10-25T06:57:00.849Z",
    "path": "../public/_nuxt/Search-b5e9e8df.mjs"
  },
  "/_nuxt/Swatch-1771fef0.mjs": {
    "type": "application/javascript",
    "etag": "\"2f0-P/i/5/ceCgVW/k+wdE7Yia596Qg\"",
    "mtime": "2021-10-25T06:57:00.849Z",
    "path": "../public/_nuxt/Swatch-1771fef0.mjs"
  },
  "/_nuxt/Swatches-c53eca0e.mjs": {
    "type": "application/javascript",
    "etag": "\"276-lCCuh7EYAqy0fwSTW03UuDD+Yr4\"",
    "mtime": "2021-10-25T06:57:00.848Z",
    "path": "../public/_nuxt/Swatches-c53eca0e.mjs"
  },
  "/_nuxt/Tabs-6f71539f.mjs": {
    "type": "application/javascript",
    "etag": "\"344-2uF5NGCea1t29D3i10dcyMPV3OA\"",
    "mtime": "2021-10-25T06:57:00.848Z",
    "path": "../public/_nuxt/Tabs-6f71539f.mjs"
  },
  "/_nuxt/TypeItem-b7c034f9.mjs": {
    "type": "application/javascript",
    "etag": "\"342-tDA7klW6B2AGZtgLde1qpXhOhP8\"",
    "mtime": "2021-10-25T06:57:00.848Z",
    "path": "../public/_nuxt/TypeItem-b7c034f9.mjs"
  },
  "/_nuxt/TypeList-102f4402.mjs": {
    "type": "application/javascript",
    "etag": "\"1c8-a+iTsNquxiWJR6+3oD5BVyz3UAQ\"",
    "mtime": "2021-10-25T06:57:00.847Z",
    "path": "../public/_nuxt/TypeList-102f4402.mjs"
  },
  "/_nuxt/[...slug]-78e66d6f.mjs": {
    "type": "application/javascript",
    "etag": "\"14b3-aRXnNTeIsykMDG1wKnzTntiBMwI\"",
    "mtime": "2021-10-25T06:57:00.847Z",
    "path": "../public/_nuxt/[...slug]-78e66d6f.mjs"
  },
  "/_nuxt/entry-58ba788d.mjs": {
    "type": "application/javascript",
    "etag": "\"355f0-+NLVKW50w5M7sH9t+zpBwDaeYOM\"",
    "mtime": "2021-10-25T06:57:00.812Z",
    "path": "../public/_nuxt/entry-58ba788d.mjs"
  },
  "/_nuxt/foundation-bcd6d3b9.mjs": {
    "type": "application/javascript",
    "etag": "\"8d6-vtvqiSARGiw3rHlv0qNvZZXDDAI\"",
    "mtime": "2021-10-25T06:57:00.810Z",
    "path": "../public/_nuxt/foundation-bcd6d3b9.mjs"
  },
  "/_nuxt/helper-25ab79ba.mjs": {
    "type": "application/javascript",
    "etag": "\"5ed-m6epMNBa8yv4iXDyiF0koj+WMZ8\"",
    "mtime": "2021-10-25T06:57:00.810Z",
    "path": "../public/_nuxt/helper-25ab79ba.mjs"
  },
  "/_nuxt/home-f7567c07.mjs": {
    "type": "application/javascript",
    "etag": "\"463-wMo5jnDvucxN+wSixQL6mwmz/Lc\"",
    "mtime": "2021-10-25T06:57:00.809Z",
    "path": "../public/_nuxt/home-f7567c07.mjs"
  },
  "/_nuxt/index-04b61630.mjs": {
    "type": "application/javascript",
    "etag": "\"45e-vOiEC244KmWznOAKtBi+EJ8ST+E\"",
    "mtime": "2021-10-25T06:57:00.808Z",
    "path": "../public/_nuxt/index-04b61630.mjs"
  },
  "/_nuxt/info-1f1a67b1.mjs": {
    "type": "application/javascript",
    "etag": "\"22d-R8l7PlYfo/H3Y4gGohKXUl74sz0\"",
    "mtime": "2021-10-25T06:57:00.807Z",
    "path": "../public/_nuxt/info-1f1a67b1.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"2714-5dVb7P4neuhpo/qf3bV/8NuLpr8\"",
    "mtime": "2021-10-25T06:57:00.807Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/screens-704e9088.mjs": {
    "type": "application/javascript",
    "etag": "\"7b13-k4l2DnVorQR1J6vlWxTYEa7Rf/Q\"",
    "mtime": "2021-10-25T06:57:00.806Z",
    "path": "../public/_nuxt/screens-704e9088.mjs"
  },
  "/_nuxt/assets/Header.1296e7ed.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9f3-dGZW0ZTa/Zjemeek6VN324Mw8Lw\"",
    "mtime": "2021-10-25T06:57:00.846Z",
    "path": "../public/_nuxt/assets/Header.1296e7ed.css"
  },
  "/_nuxt/assets/IncludedContent.c8eb7b9e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"411-7F/OoZMmngqC/ffGaSRC/0M1NSM\"",
    "mtime": "2021-10-25T06:57:00.846Z",
    "path": "../public/_nuxt/assets/IncludedContent.c8eb7b9e.css"
  },
  "/_nuxt/assets/IncludedContentItem.2d79d5fd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a51-C/uUUv2b/hTcFD0EkgfmU0gm4rM\"",
    "mtime": "2021-10-25T06:57:00.846Z",
    "path": "../public/_nuxt/assets/IncludedContentItem.2d79d5fd.css"
  },
  "/_nuxt/assets/Info.17288286.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"88e-Y993adHohx90+An65KvllPTdS7U\"",
    "mtime": "2021-10-25T06:57:00.845Z",
    "path": "../public/_nuxt/assets/Info.17288286.css"
  },
  "/_nuxt/assets/Inter-Black.8b21d5be.woff": {
    "type": "font/woff",
    "etag": "\"21e0c-BREamVgGWqHImjjlsAkI/HVECbo\"",
    "mtime": "2021-10-25T06:57:00.845Z",
    "path": "../public/_nuxt/assets/Inter-Black.8b21d5be.woff"
  },
  "/_nuxt/assets/Inter-Black.fc10113c.woff2": {
    "type": "font/woff2",
    "etag": "\"191d4-rH8KuWqGQUpDEnyCdOx7HAy0MSY\"",
    "mtime": "2021-10-25T06:57:00.844Z",
    "path": "../public/_nuxt/assets/Inter-Black.fc10113c.woff2"
  },
  "/_nuxt/assets/Inter-BlackItalic.87235581.woff": {
    "type": "font/woff",
    "etag": "\"23d88-QLjjSxEfvxRkinat3+potTjK6/8\"",
    "mtime": "2021-10-25T06:57:00.844Z",
    "path": "../public/_nuxt/assets/Inter-BlackItalic.87235581.woff"
  },
  "/_nuxt/assets/Inter-BlackItalic.bc80081d.woff2": {
    "type": "font/woff2",
    "etag": "\"1a8d0-FFp/iID8rK26X8CWkiaITBR0Qhs\"",
    "mtime": "2021-10-25T06:57:00.843Z",
    "path": "../public/_nuxt/assets/Inter-BlackItalic.bc80081d.woff2"
  },
  "/_nuxt/assets/Inter-Bold.3e242080.woff": {
    "type": "font/woff",
    "etag": "\"22f68-5aSeWigRnpYFOabeC/j3K4EDYq8\"",
    "mtime": "2021-10-25T06:57:00.842Z",
    "path": "../public/_nuxt/assets/Inter-Bold.3e242080.woff"
  },
  "/_nuxt/assets/Inter-Bold.c63158ba.woff2": {
    "type": "font/woff2",
    "etag": "\"19e9c-HpSg36yLqwlH6psLb7Zj661czrU\"",
    "mtime": "2021-10-25T06:57:00.841Z",
    "path": "../public/_nuxt/assets/Inter-Bold.c63158ba.woff2"
  },
  "/_nuxt/assets/Inter-BoldItalic.3f211964.woff2": {
    "type": "font/woff2",
    "etag": "\"1b4c0-+3WgUFEZa3zyzY/dJRSfHCKeGAU\"",
    "mtime": "2021-10-25T06:57:00.841Z",
    "path": "../public/_nuxt/assets/Inter-BoldItalic.3f211964.woff2"
  },
  "/_nuxt/assets/Inter-BoldItalic.ace8e094.woff": {
    "type": "font/woff",
    "etag": "\"24e0c-j4js0BQKd9MHFV5wNMKHZgs+jWM\"",
    "mtime": "2021-10-25T06:57:00.840Z",
    "path": "../public/_nuxt/assets/Inter-BoldItalic.ace8e094.woff"
  },
  "/_nuxt/assets/Inter-ExtraBold.307d9809.woff2": {
    "type": "font/woff2",
    "etag": "\"19e7c-cvbk1RJNCXNdo8uXugXxJsVlGZc\"",
    "mtime": "2021-10-25T06:57:00.840Z",
    "path": "../public/_nuxt/assets/Inter-ExtraBold.307d9809.woff2"
  },
  "/_nuxt/assets/Inter-ExtraBold.f053602c.woff": {
    "type": "font/woff",
    "etag": "\"22e48-ecb6bSaRxu2QPQiNDF7R64dhZzY\"",
    "mtime": "2021-10-25T06:57:00.839Z",
    "path": "../public/_nuxt/assets/Inter-ExtraBold.f053602c.woff"
  },
  "/_nuxt/assets/Inter-ExtraBoldItalic.6deefddf.woff": {
    "type": "font/woff",
    "etag": "\"24c64-sFkiu6/3OvyhI+g4yhvXwAiMREw\"",
    "mtime": "2021-10-25T06:57:00.838Z",
    "path": "../public/_nuxt/assets/Inter-ExtraBoldItalic.6deefddf.woff"
  },
  "/_nuxt/assets/Inter-ExtraBoldItalic.cf6b1d6c.woff2": {
    "type": "font/woff2",
    "etag": "\"1b45c-GyeN00g09iXXxNf/I9qdyPxwVeI\"",
    "mtime": "2021-10-25T06:57:00.838Z",
    "path": "../public/_nuxt/assets/Inter-ExtraBoldItalic.cf6b1d6c.woff2"
  },
  "/_nuxt/assets/Inter-ExtraLight.015dad27.woff": {
    "type": "font/woff",
    "etag": "\"225b4-/l2ez3MYrJLW1eFkIdtxnpoAGiU\"",
    "mtime": "2021-10-25T06:57:00.837Z",
    "path": "../public/_nuxt/assets/Inter-ExtraLight.015dad27.woff"
  },
  "/_nuxt/assets/Inter-ExtraLight.b6cd094a.woff2": {
    "type": "font/woff2",
    "etag": "\"19728-4To3bIWjLkgqC9DHbkv1pgLQVyg\"",
    "mtime": "2021-10-25T06:57:00.836Z",
    "path": "../public/_nuxt/assets/Inter-ExtraLight.b6cd094a.woff2"
  },
  "/_nuxt/assets/Inter-ExtraLightItalic.32e53d8a.woff": {
    "type": "font/woff",
    "etag": "\"249ec-J8XTTrYDhuJSdw+LJLcvXTcWxEk\"",
    "mtime": "2021-10-25T06:57:00.836Z",
    "path": "../public/_nuxt/assets/Inter-ExtraLightItalic.32e53d8a.woff"
  },
  "/_nuxt/assets/Inter-ExtraLightItalic.db229bf3.woff2": {
    "type": "font/woff2",
    "etag": "\"1b320-57VLc5HQ5rvDLcvBgXaI9FXDWcE\"",
    "mtime": "2021-10-25T06:57:00.835Z",
    "path": "../public/_nuxt/assets/Inter-ExtraLightItalic.db229bf3.woff2"
  },
  "/_nuxt/assets/Inter-Italic.900058df.woff2": {
    "type": "font/woff2",
    "etag": "\"1a17c-oky8nA5W9xlse8aOxBuFbYQjdiI\"",
    "mtime": "2021-10-25T06:57:00.835Z",
    "path": "../public/_nuxt/assets/Inter-Italic.900058df.woff2"
  },
  "/_nuxt/assets/Inter-Italic.cd1eda97.woff": {
    "type": "font/woff",
    "etag": "\"233f4-87paYPSsSclz1Y9e9M/q7plJYzM\"",
    "mtime": "2021-10-25T06:57:00.834Z",
    "path": "../public/_nuxt/assets/Inter-Italic.cd1eda97.woff"
  },
  "/_nuxt/assets/Inter-Light.36b86832.woff2": {
    "type": "font/woff2",
    "etag": "\"1978c-Cgzo3JK6byCvV+6zQeFgN1+XEmg\"",
    "mtime": "2021-10-25T06:57:00.833Z",
    "path": "../public/_nuxt/assets/Inter-Light.36b86832.woff2"
  },
  "/_nuxt/assets/Inter-Light.4871aed0.woff": {
    "type": "font/woff",
    "etag": "\"22558-mWNkQ5zXdyPf0tOUGUbmO2YSLp8\"",
    "mtime": "2021-10-25T06:57:00.833Z",
    "path": "../public/_nuxt/assets/Inter-Light.4871aed0.woff"
  },
  "/_nuxt/assets/Inter-LightItalic.737ac201.woff2": {
    "type": "font/woff2",
    "etag": "\"1b2e4-ur1n0o52EhLkjgT8NJUm/fVmW6c\"",
    "mtime": "2021-10-25T06:57:00.832Z",
    "path": "../public/_nuxt/assets/Inter-LightItalic.737ac201.woff2"
  },
  "/_nuxt/assets/Inter-LightItalic.7d291e85.woff": {
    "type": "font/woff",
    "etag": "\"24a4c-qCE8eefNyOsLD9gzeGZJDfVgP5U\"",
    "mtime": "2021-10-25T06:57:00.832Z",
    "path": "../public/_nuxt/assets/Inter-LightItalic.7d291e85.woff"
  },
  "/_nuxt/assets/Inter-Medium.1b498b95.woff2": {
    "type": "font/woff2",
    "etag": "\"19dc4-krMFJzBLXcgPRemX4LGsTHARChg\"",
    "mtime": "2021-10-25T06:57:00.831Z",
    "path": "../public/_nuxt/assets/Inter-Medium.1b498b95.woff2"
  },
  "/_nuxt/assets/Inter-Medium.53deda46.woff": {
    "type": "font/woff",
    "etag": "\"22cd8-ytjPyE6/YQE4rvY+aUkJf/SNct0\"",
    "mtime": "2021-10-25T06:57:00.830Z",
    "path": "../public/_nuxt/assets/Inter-Medium.53deda46.woff"
  },
  "/_nuxt/assets/Inter-MediumItalic.205c8989.woff": {
    "type": "font/woff",
    "etag": "\"24dcc-XP4SUj0ZeHspEGhIORTs7oUmG84\"",
    "mtime": "2021-10-25T06:57:00.830Z",
    "path": "../public/_nuxt/assets/Inter-MediumItalic.205c8989.woff"
  },
  "/_nuxt/assets/Inter-MediumItalic.81600858.woff2": {
    "type": "font/woff2",
    "etag": "\"1b638-MVXh4f43sIvCwkPut+bcc644tbg\"",
    "mtime": "2021-10-25T06:57:00.829Z",
    "path": "../public/_nuxt/assets/Inter-MediumItalic.81600858.woff2"
  },
  "/_nuxt/assets/Inter-Regular.d612f121.woff2": {
    "type": "font/woff2",
    "etag": "\"18234-+WNIJgdR6nix0j6VV9spcpC9ryg\"",
    "mtime": "2021-10-25T06:57:00.828Z",
    "path": "../public/_nuxt/assets/Inter-Regular.d612f121.woff2"
  },
  "/_nuxt/assets/Inter-Regular.ef1f23c0.woff": {
    "type": "font/woff",
    "etag": "\"20ad4-cppFUbnMWXnzk0cnnW/txmIL8UE\"",
    "mtime": "2021-10-25T06:57:00.828Z",
    "path": "../public/_nuxt/assets/Inter-Regular.ef1f23c0.woff"
  },
  "/_nuxt/assets/Inter-SemiBold.15226129.woff2": {
    "type": "font/woff2",
    "etag": "\"19d4c-36n489eb+KAAH+cu6trQSQy6Wcw\"",
    "mtime": "2021-10-25T06:57:00.827Z",
    "path": "../public/_nuxt/assets/Inter-SemiBold.15226129.woff2"
  },
  "/_nuxt/assets/Inter-SemiBold.653fed7a.woff": {
    "type": "font/woff",
    "etag": "\"22e54-eulquZDHiB+ClHwb3Ef0F5S4SNc\"",
    "mtime": "2021-10-25T06:57:00.827Z",
    "path": "../public/_nuxt/assets/Inter-SemiBold.653fed7a.woff"
  },
  "/_nuxt/assets/Inter-SemiBoldItalic.3b6df7d0.woff2": {
    "type": "font/woff2",
    "etag": "\"1b5b0-Kcw/u1azbSwNq39CxCDrvS7pyzY\"",
    "mtime": "2021-10-25T06:57:00.826Z",
    "path": "../public/_nuxt/assets/Inter-SemiBoldItalic.3b6df7d0.woff2"
  },
  "/_nuxt/assets/Inter-SemiBoldItalic.95e68b6b.woff": {
    "type": "font/woff",
    "etag": "\"24e8c-vmmg6ECYpZtT6eIE4O0WibZwZDM\"",
    "mtime": "2021-10-25T06:57:00.825Z",
    "path": "../public/_nuxt/assets/Inter-SemiBoldItalic.95e68b6b.woff"
  },
  "/_nuxt/assets/Inter-Thin.77d96c1c.woff2": {
    "type": "font/woff2",
    "etag": "\"18530-4qgrAdn3PS+59pC+/peDUamXTlU\"",
    "mtime": "2021-10-25T06:57:00.825Z",
    "path": "../public/_nuxt/assets/Inter-Thin.77d96c1c.woff2"
  },
  "/_nuxt/assets/Inter-Thin.e6bced8e.woff": {
    "type": "font/woff",
    "etag": "\"212f0-BPO0YCj1oPsqZPeb8G/RCFd3lP8\"",
    "mtime": "2021-10-25T06:57:00.824Z",
    "path": "../public/_nuxt/assets/Inter-Thin.e6bced8e.woff"
  },
  "/_nuxt/assets/Inter-ThinItalic.70648e9b.woff": {
    "type": "font/woff",
    "etag": "\"23848-oi2VUv4XI+s3YsK7y1aoOKMtbHA\"",
    "mtime": "2021-10-25T06:57:00.823Z",
    "path": "../public/_nuxt/assets/Inter-ThinItalic.70648e9b.woff"
  },
  "/_nuxt/assets/Inter-ThinItalic.d82beee8.woff2": {
    "type": "font/woff2",
    "etag": "\"1a000-fPuJOIft91drDap74+qWYsLXvEg\"",
    "mtime": "2021-10-25T06:57:00.823Z",
    "path": "../public/_nuxt/assets/Inter-ThinItalic.d82beee8.woff2"
  },
  "/_nuxt/assets/Inter-italic.var.d1401419.woff2": {
    "type": "font/woff2",
    "etag": "\"3bd2c-byCgRpF7+G1LbMKcTiUVvWTSy5s\"",
    "mtime": "2021-10-25T06:57:00.822Z",
    "path": "../public/_nuxt/assets/Inter-italic.var.d1401419.woff2"
  },
  "/_nuxt/assets/Inter-roman.var.17fe38ab.woff2": {
    "type": "font/woff2",
    "etag": "\"3776c-eiYC0uuwjOiV4zrdtv5ZXxApQx4\"",
    "mtime": "2021-10-25T06:57:00.821Z",
    "path": "../public/_nuxt/assets/Inter-roman.var.17fe38ab.woff2"
  },
  "/_nuxt/assets/Inter.var.85f08b5f.woff2": {
    "type": "font/woff2",
    "etag": "\"4f500-+Rnac4RwbWkk8Q1WziWBKe1JiEU\"",
    "mtime": "2021-10-25T06:57:00.820Z",
    "path": "../public/_nuxt/assets/Inter.var.85f08b5f.woff2"
  },
  "/_nuxt/assets/Intro.d3f24a2c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"66f-dj9epM+ASB4WN7FUBwpntCIIbr8\"",
    "mtime": "2021-10-25T06:57:00.819Z",
    "path": "../public/_nuxt/assets/Intro.d3f24a2c.css"
  },
  "/_nuxt/assets/Overlay.f91bce47.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"fe6-pz4RT8YB4eJgBclNU7jSI91+VyM\"",
    "mtime": "2021-10-25T06:57:00.819Z",
    "path": "../public/_nuxt/assets/Overlay.f91bce47.css"
  },
  "/_nuxt/assets/ScreenItem.132c1b78.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"82f-5irL9Rc5sk1BX/OI5xV9lvHiiOQ\"",
    "mtime": "2021-10-25T06:57:00.819Z",
    "path": "../public/_nuxt/assets/ScreenItem.132c1b78.css"
  },
  "/_nuxt/assets/ScreenItem.ec65995e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a81-BMViEyeaBYQfRdxDrwbPTFXxf88\"",
    "mtime": "2021-10-25T06:57:00.818Z",
    "path": "../public/_nuxt/assets/ScreenItem.ec65995e.css"
  },
  "/_nuxt/assets/ScreenList.c99b970f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"521-yl80spaTnLJX4GQVIB7vl4oEWo0\"",
    "mtime": "2021-10-25T06:57:00.818Z",
    "path": "../public/_nuxt/assets/ScreenList.c99b970f.css"
  },
  "/_nuxt/assets/ScreenList.e6696edd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"46c-SNDOtzvxNa1FdpDRiA64khumwi8\"",
    "mtime": "2021-10-25T06:57:00.818Z",
    "path": "../public/_nuxt/assets/ScreenList.e6696edd.css"
  },
  "/_nuxt/assets/Search.ac867f09.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"562-Lp17ioaglyGV2w8jGL2Jtsy0X/A\"",
    "mtime": "2021-10-25T06:57:00.817Z",
    "path": "../public/_nuxt/assets/Search.ac867f09.css"
  },
  "/_nuxt/assets/Swatch.a0577ede.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"75c-hf/dJxr6pnIDo3WnBqlkwP+n71Q\"",
    "mtime": "2021-10-25T06:57:00.817Z",
    "path": "../public/_nuxt/assets/Swatch.a0577ede.css"
  },
  "/_nuxt/assets/Swatches.a09eac50.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"48c-V92Y3vU5gtiF0IAF+jhj6z15azA\"",
    "mtime": "2021-10-25T06:57:00.816Z",
    "path": "../public/_nuxt/assets/Swatches.a09eac50.css"
  },
  "/_nuxt/assets/Tabs.5e587ad7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"650-/5IbydQRjkJ6aEA2apeaDwviPzA\"",
    "mtime": "2021-10-25T06:57:00.816Z",
    "path": "../public/_nuxt/assets/Tabs.5e587ad7.css"
  },
  "/_nuxt/assets/TypeItem.b4e97436.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52b-PIPBJtjQhZ8LulzGRFu+MRG/Lm8\"",
    "mtime": "2021-10-25T06:57:00.816Z",
    "path": "../public/_nuxt/assets/TypeItem.b4e97436.css"
  },
  "/_nuxt/assets/TypeList.0eedee9f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a6-h31mqsB5T0Do8At1FixJG8I4hoI\"",
    "mtime": "2021-10-25T06:57:00.815Z",
    "path": "../public/_nuxt/assets/TypeList.0eedee9f.css"
  },
  "/_nuxt/assets/[...slug].0353127c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"642-aPcwympJgBWwcUJdMTnk3rURVnI\"",
    "mtime": "2021-10-25T06:57:00.815Z",
    "path": "../public/_nuxt/assets/[...slug].0353127c.css"
  },
  "/_nuxt/assets/entry.878393a9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3ee5-gd3Tqmcln1kxUUGiq+DJZQ1H4Do\"",
    "mtime": "2021-10-25T06:57:00.814Z",
    "path": "../public/_nuxt/assets/entry.878393a9.css"
  },
  "/_nuxt/assets/foundation.1c3f1acd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"467-5ZeuHGc5IQ8qPAbhk7+2A7Ca/Rw\"",
    "mtime": "2021-10-25T06:57:00.814Z",
    "path": "../public/_nuxt/assets/foundation.1c3f1acd.css"
  },
  "/_nuxt/assets/helper.c31d7d64.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ef-67YStcWsLItc4Z7cKlJVzRMi65k\"",
    "mtime": "2021-10-25T06:57:00.813Z",
    "path": "../public/_nuxt/assets/helper.c31d7d64.css"
  },
  "/_nuxt/assets/index.0ddeeaeb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"585-kM53sjVggmewYb21s5W0YaXoapI\"",
    "mtime": "2021-10-25T06:57:00.813Z",
    "path": "../public/_nuxt/assets/index.0ddeeaeb.css"
  },
  "/_nuxt/assets/info.1de2a184.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3fc-hz1BdnN+kO3wB0BMRfdXDrea3zM\"",
    "mtime": "2021-10-25T06:57:00.813Z",
    "path": "../public/_nuxt/assets/info.1de2a184.css"
  }
};

const mainDir = dirname(fileURLToPath(globalThis.entryURL));

function readAsset (id) {
  return promises.readFile(resolve(mainDir, getAsset(id).path))
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const PUBLIC_PATH = "/_nuxt/";
const TWO_DAYS = 2 * 60 * 60 * 24;
const STATIC_ASSETS_BASE = "/Users/christoph/workspace/bitcoinuikit.com/dist" + "/" + "1635145016";
async function serveStatic(req, res) {
  if (!METHODS.includes(req.method)) {
    return;
  }
  let id = withLeadingSlash(withoutTrailingSlash(parseURL(req.url).pathname));
  let asset = getAsset(id);
  if (!asset) {
    const _id = id + "/index.html";
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
    }
  }
  if (!asset) {
    if (id.startsWith(PUBLIC_PATH) && !id.startsWith(STATIC_ASSETS_BASE)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    res.statusCode = 304;
    return res.end("Not Modified (etag)");
  }
  const ifModifiedSinceH = req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      res.statusCode = 304;
      return res.end("Not Modified (mtime)");
    }
  }
  if (asset.type) {
    res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    res.setHeader("Last-Modified", asset.mtime);
  }
  if (id.startsWith(PUBLIC_PATH)) {
    res.setHeader("Cache-Control", `max-age=${TWO_DAYS}, immutable`);
  }
  const contents = await readAsset(id);
  return res.end(contents);
}

export { serveStatic as default };
