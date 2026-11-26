# Header და დივაისის სწრაფი გახსნა

საწყისი production SHA e007644. ბრენჩი fix/shared-header-focus.

ხუთივე გვერდზე Home-ის header markup და css/navigation.css/js/navigation.js გამოიყენება. აქტიური გვერდის მონიშვნა თითოეულ გვერდზე ინახება. ძველი Projects menu handler მოიხსნა, main.js კი საერთო navigation მოდულს აღარ იმეორებს.

პლანშეტის opening მდგომარეობაში wheel გვერდს აღარ ასქროლავს. გადიდების დასრულებისას ხელახალი revealShowroom აღარ იძახება. დივაისის ფოკუსის ანიმაცია 900ms-იდან 550ms-მდე შემცირდა. MeeTab-ის preload იწყება დასრულებული გადიდების შემდეგ. იგივე ლოგიკა სხვა დივაისების გახსნასაც ემსახურება.

ბრაუზერის შედეგები final-tests.log-შია. ტესტი tests/header_focus.py-ში ინახება. ფოკუსის ტესტში demo document იზოლირებულია, რათა შემოწმდეს ზუსტად wheel/zoom/scroll-ის ქცევა. მოწმდება ხუთივე გვერდის header ზომა/შრიფტი, მობილური menu გახსნა/Escape და Chromium-ში პლანშეტის არჩევის შემდეგ სწრაფი wheel input. ეს არის viewport ემულაცია. ფიზიკური მოწყობილობების შემოწმება არ შესრულებულა.

Rollback შესაძლებელია ამ ცვლილებების commit-ის git revert-ით. გამოქვეყნება მფლობელის შემდგომ თანხმობას ელოდება.

| ტესტი | შედეგი |
|---|---|
| Chromium ხუთივე header-ის ზომა და შრიფტი | PASS |
| WebKit ხუთივე header-ის ზომა და შრიფტი | PASS |
| ორივე ბრაუზერში მობილური მენიუ და Escape | PASS |
| Chromium პლანშეტის გახსნისას მყისიერი wheel, scrollY უცვლელია | PASS |
| ფიზიკური iPhone/Android და hardware FPS | NOT RUN |

ტესტირების ბრძანება `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 python3 tests/header_focus.py`. წყაროს manifest განახლებულია. ცვლილებები [PR #26](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/26)-შია.

მფლობელის დამატებითი მოთხოვნით ამოღებულია Lab-ის Shader Playground და Lighting Studio, მათი მოდულები და preview წესები. Chromium/WebKit-ში შემოწმდა დარჩენილი Motion Physics, Particle Field და Spatial UI-ის გახსნა, ასევე არსებული ჰოლოგრამის ხილვადობა. შედეგი PASS ორივე ძრავში. მფლობელმა ამ ცვლილებებთან ერთად merge და გამოქვეყნება დაამტკიცა.
