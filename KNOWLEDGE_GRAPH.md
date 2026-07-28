# Software Engineering Club Site — Knowledge Graph

## Purpose

This vanilla front-end presents the Software Engineering Club, explains its activities, and collects membership registrations.

## Graph

```mermaid
graph TD
    Site[Club registration website] --> HTML[index.html]
    Site --> CSS[style.css]
    Site --> JS[script.js]
    Site --> Assets[asset/]

    HTML --> Header[Sticky brand header]
    HTML --> Hero[Hero slider]
    HTML --> Info[Club information sections]
    HTML --> Form[Registration form]
    HTML --> Modal[Loading and success feedback]

    Assets --> Logo[img_logo_40x82.png]
    Assets --> Cover[SEC cover photo 3.png]
    Assets --> Algorithm[algorithm-spring-25.jpg]
    Assets --> Event[IMG_9153.JPG]

    Logo --> Header
    Logo --> Form
    Cover --> Hero
    Algorithm --> Hero
    Event --> Hero

    CSS --> Layout[Responsive layout]
    CSS --> SliderStyle[Slider transitions and controls]
    CSS --> FormStyle[Form states and modal styling]

    JS --> SliderLogic[Auto-play, arrows, dots, keyboard, pause]
    JS --> Validation[Form validation]
    JS --> Feedback[Submission loading and success modal]

    SliderLogic --> Hero
    Validation --> Form
    Feedback --> Modal
```

## Runtime relationships

- `index.html` is the only page and loads `style.css` plus `script.js`.
- The hero uses all three large images from `asset/`; JavaScript changes the active slide every five seconds.
- Slider arrows, dots, left/right keyboard keys, hover, and focus provide manual control.
- The logo is reused in the sticky site header and registration form header.
- The registration form remains client-side and does not send data to a server.

## Constraints

- HTML5, CSS3, and browser JavaScript only.
- No framework, build tool, package dependency, or external slider library.
- Local images are the visual source of truth.
