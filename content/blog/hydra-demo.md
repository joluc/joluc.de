---
title: "My Hydra Workshop Experience"
date: 2024-10-19T12:00:00+01:00
draft: false
tags: ["visual", "hydra", "workshop", "live-coding"]
description: "Exploring live coding visuals with Olivia Jack at the 'All The Rivers' workshop in Berlin."
Image: "/images/hydra-synth.png"
---

I recently had the opportunity to participate in the **videohex** workshop at **ausland** in Berlin, which was part of the "All The Rivers" series. I've always been impressed by the demo scene and the art of hacking shaders to create visual effects, so this was a perfect chance to dive in.

The workshop was led by [Olivia Jack](https://hydra.ojack.xyz/), the creator of **Hydra**, a live-codeable video synthesizer and coding environment that runs directly in the browser.

![Hydra Event](/images/hydra-event-vertical.jpg)
*A look at the setup during the workshop.*

It was a fantastic experience to play around live with the tool. Hydra allows you to use JavaScript to create glitchy video effects, generative graphics, and feedback loops in real-time. The immediate visual feedback makes it incredibly engaging and a powerful tool for audio-visual performances.

Below is a small example of what Hydra can do, running right here in the browser:

{{< hydra >}}joluc{{< /hydra >}}

You can also use it with different text:

{{< hydra preset="pixel" >}}Joluc{{< /hydra >}}

## Reference Links

Here are some useful resources to get started with Hydra and live coding:

*   **Editor:** [hydra.ojack.xyz](https://hydra.ojack.xyz/)
*   **Documentation:** [Hydra Functions / API](https://hydra.ojack.xyz/api/)
*   **Live Coding Sound:** [Strudel](https://strudel.cc/)

## Key Commands

*   `CTRL + Shift + Enter`: Run all code
*   `ALT (Option) + Enter`: Run current block of code
*   `CTRL + H`: Hide/Show code
*   `CTRL + Shift + F`: Format code

## Examples

Here are some interesting examples I took note of during the workshop. Click the links to open them directly in the Hydra editor.

*   [Oscillator + Rotate](https://hydra.ojack.xyz/?code=JTBBJTIwJTBBJTBBJTBBJTIwJTIwJTIwb3NjKDEwJTJDJTIwMC4wMiUyQyUyMDEpLnJvdGF0ZSgwJTJDJTIwMC4xKS5rYWxlaWQoKS5yZXBlYXQoKS5vdXQoKQ%3D%3D)
*   [Camera Input](https://hydra.ojack.xyz/?code=JTBBJTIwJTBBczAuaW5pdENhbSgpJTBBJTBBc3JjKHMwKS5yb3RhdGUoMCUyQyUyMDAuMSkuY29sb3IoLTElMkMlMjAxJTJDJTIwMC4yKS5yZXBlYXQoKS5vdXQoKQ%3D%3D)
*   [Multiple Outputs](https://hydra.ojack.xyz/?code=JTBBJTIwJTBBczAuaW5pdENhbSgpJTBBJTBBc3JjKHMwKS5vdXQobzApJTBBJTBBb3NjKDEwKS5vdXQobzEpJTBBJTBBcmVuZGVyKCk%3D)
*   [Camera Diff](https://hydra.ojack.xyz/?code=JTBBJTIwJTBBczAuaW5pdENhbSgpJTBBJTBBc3JjKHMwKS5vdXQobzApJTBBJTBBb3NjKDIwKS5vdXQobzEpJTBBJTBBc3JjKG8wKS5kaWZmKG8xKS5vdXQobzIpJTBBJTBBcmVuZGVyKCk%3D)
*   [Blend 3 Sources](https://hydra.ojack.xyz/?code=JTBBJTIwJTBBczAuaW5pdENhbSgpJTBBJTBBc3JjKHMwKS5vdXQobzApJTBBJTBBb3NjKDIwKS5vdXQobzEpJTBBJTBBc2hhcGUoKS5vdXQobzIpJTBBJTBBc3JjKG8wKS5ibGVuZChvMSkuYmxlbmQobzIpLm91dChvMyklMEElMEElMEFyZW5kZXIoKQ%3D%3D)
*   [Modulate](https://hydra.ojack.xyz/?code=JTBBJTIwJTBBczAuaW5pdENhbSgpJTBBJTBBc3JjKHMwKS5vdXQobzApJTBBJTBBb3NjKDIwJTJDJTIwMC4wMikua2FsZWlkKCkucGl4ZWxhdGUoKS5vdXQobzEpJTBBJTBBc3JjKG8wKS5tb2R1bGF0ZShvMSkub3V0KG8yKSUwQSUwQXJlbmRlcigp)
*   [Init Screen](https://hydra.ojack.xyz/?code=JTBBJTIwJTBBJTIwJTJGJTJGJTIwVHlwZSUyMHNvbWUlMjBjb2RlJTIwb24lMjBhJTIwbmV3JTIwbGluZSUyMChzdWNoJTIwYXMlMjAlMjJvc2MoKS5vdXQoKSUyMiklMkMlMjBhbmQlMjBwcmVzcyUyMENUUkwlMkJzaGlmdCUyQmVudGVyJTBBJTBBJTBBczAuaW5pdFNjcmVlbigpJTBBJTBBc3JjKHMwKS5tb2R1bGF0ZShvc2MoMTApKS5vdXQoKQ%3D%3D)
*   [Gamepad Control](https://hydra.ojack.xyz/?code=JTBBZ2FtZSUyMCUzRCUyMCU3QiUyMHglM0ElMjAwLjUlMkMlMjB5JTNBJTIwMC41JTJDJTIwZHglM0ElMjAwJTJDJTIwZHklM0ElMjAwJTIwJTdEJTBBJTBBdXBkYXRlJTIwJTNEJTIwKCklMjAlM0QlM0UlMjAlN0IlMEElMjAlMjBjb25zdCUyMGdhbWVwYWRzJTIwJTNEJTIwbmF2aWdhdG9yLmdldEdhbWVwYWRzKCklMEElMjAlMjBjb25zb2xlLmxvZyhnYW1lcGFkcyU1QjAlNUQpJTBBJTIwaWYoZ2FtZXBhZHMlNUIwJTVEJTIwISUzRCUzRCUyMG51bGwlMjAlMjYlMjYlMjBnYW1lcGFkcyU1QjAlNUQuYXhlcyklMjAlN0IlMEElMjAlMjAlMjBnYW1lLmR4JTIwJTNEJTIwZ2FtZXBhZHMlNUIwJTVELmF4ZXMlNUIwJTVEJTBBJTIwJTIwJTIwZ2FtZS5keSUyMCUzRCUyMGdhbWVwYWRzJTVCMCU1RC5heGVzJTVCMSU1RCUwQSUyMCUyMCUyMGdhbWUueCUyMCUyQiUzRCUyMGdhbWUuZHglMjAqMC4wMDIlMEElMjAlMjAlMjBnYW1lLnklMjAlMkIlM0QlMjBnYW1lLmR5JTIwKiUyMDAuMDAyJTIwJTdEJTBBJTdEJTBBJTBBc2hhcGUoNCUyQyUyMDAuMDQlMkMlMjAwLjA1KS5jb250cmFzdCgpLnNjcm9sbCgoKSUyMCUzRCUzRSUyMGdhbWUueCUyQyUyMCgpJTIwJTNEJTNFJTIwZ2FtZS55KS5sdW1hKCkub3V0KCklMEElMEFzcmMobzEpLmxheWVyKG8wKS5vdXQobzEpJTBBJTBBcmVuZGVyKG8xKQ%3D%3D)
*   [Video and Camera](https://hydra.ojack.xyz/?code=JTJGJTJGJTIwVHlwZSUyMHNvbWUlMjBjb2RlJTIwb24lMjBhJTIwbmV3JTIwbGluZSUyMChzdWNoJTIwYXMlMjAlMjJvc2MoKS5vdXQoKSUyMiklMkMlMjBhbmQlMjBwcmVzcyUyMENUUkwlMkJzaGlmdCUyQmVudGVyJTBBJTBBczAuaW5pdENhbSgxKSUwQSUwQXMxLmluaXRWaWRlbyglMjJodHRwcyUzQSUyRiUyRm1lZGlhLmdpcGh5LmNvbSUyRm1lZGlhJTJGQVM5TElGdHRZemtjMCUyRmdpcGh5Lm1wNCUyMiklMEElMEElMEFzcmMoczApLmJsZW5kKHMxKS5jb250cmFzdCgpLm91dCgp)
*   [Modulate Scale](https://hydra.ojack.xyz/?code=JTBBczAuaW5pdENhbSgxKSUwQSUwQXMxLmluaXRWaWRlbyglMjJodHRwcyUzQSUyRiUyRm1lZGlhLmdpcGh5LmNvbSUyRm1lZGlhJTJGQVM5TElGdHRZemtjMCUyRmdpcGh5Lm1wNCUyMiklMEElMEElMEFzcmMoczApLm1vZHVsYXRlU2NhbGUob3NjKDUpJTJDJTIwLTAuOTkpLmNvbnRyYXN0KCkub3V0KCk%3D)
*   [Liquid Movement](https://hydra.ojack.xyz/?code=JTBBczAuaW5pdENhbSgxKSUwQSUwQSUwQXNyYyhvMCkuYmxlbmQoczAlMkMlMjAwLjEpLm1vZHVsYXRlKG8wJTJDJTIwMC4wMSkuY29udHJhc3QoMS4wNCkub3V0KG8wKQ%3D%3D)
*   [Control Shape with Mouse](https://hydra.ojack.xyz/?code=JTBBJTBBc2hhcGUoNiUyQyUyMCgpJTIwJTNEJTNFJTIwbW91c2UueCUyRndpZHRoKS5vdXQoKQ%3D%3D)
*   [Change Color/Size with Mouse](https://hydra.ojack.xyz/?code=JTBBJTBBc2hhcGUoNiUyQyUyMCgpJTIwJTNEJTNFJTIwbW91c2UueCUyRndpZHRoKSUwQSUyMCUyMC5jb2xvcigxJTJDJTIwLTEpJTBBJTIwJTIwLmh1ZSgoKSUyMCUzRCUzRSUyMG1vdXNlLnklMkZoZWlnaHQpJTBBJTIwJTIwLm91dCgp)
*   [Audio Signal](https://hydra.ojack.xyz/?code=JTBBJTBBYS5zaG93KCklMEElMEFzaGFwZSg2JTJDJTIwKCklMjAlM0QlM0UlMjBhLmZmdCU1QjAlNUQpJTBBJTIwJTIwLm91dCgp)
*   [Smooth Audio Signal](https://hydra.ojack.xyz/?code=JTBBJTBBYS5zaG93KCklMEFhLnNldFNtb290aCgwLjkpJTBBJTBBc2hhcGUoNiUyQyUyMCgpJTIwJTNEJTNFJTIwYS5mZnQlNUIwJTVEKSUwQSUyMCUyMC5vdXQoKQ%3D%3D)
*   [Sequences](https://hydra.ojack.xyz/?code=JTBBJTBBJTBBc2hhcGUoJTVCMyUyQyUyMDQlMkMlMjA1JTJDJTIwNiU1RC5mYXN0KDIpKSUwQSUyMCUyMC5vdXQoKQ%3D%3)
*   [MIDI Controller](https://hydra.ojack.xyz/?code=JTJGJTJGJTIwWW91JTIwY2FuJTIwZWl0aGVyJTIwdXNlJTIwJTYwJTQwbGF0ZXN0JTYwJTIwb3IlMjBsb2FkJTIwYSUyMHNwZWNpZmljJTIwdmVyc2lvbiUyMHdpdGglMkMlMjBmb3IlMjBleGFtcGxlJTJDJTIwJTYwJTQwMC40LjAlNjAuJTBBYXdhaXQlMjBsb2FkU2NyaXB0KCUwQSUyMCUyMCdodHRwcyUzQSUyRiUyRmNkbi5qc2RlbGl2ci5uZXQlMkZucG0lMkZoeWRyYS1taWRpJTQwbGF0ZXN0JTJGZGlzdCUyRmluZGV4LmpzJyUwQSklMEElMEElMkYlMkYlMjBVc2UlMjBtaWRpJTIwbWVzc2FnZXMlMjBmcm9tJTIwYWxsJTIwY2hhbm5lbHMlMjBvZiUyMGFsbCUyMGlucHV0cy4lMEFhd2FpdCUyMG1pZGkuc3RhcnQoJTdCJTIwY2hhbm5lbCUzQSUyMCcqJyUyQyUyMGlucHV0JTNBJTIwJyonJTIwJTdEKSUwQSUyRiUyRiUyMFNob3clMjBhJTIwc21hbGwlMjBtaWRpJTIwbW9uaXRvciUyMChzaW1pbGFyJTIwdG8lMjBoeWRyYSdzJTIwJTYwYS5zaG93KCklNjApLiUwQW1pZGkuc2hvdygpJTBBJTBBJTJGJTJGJTIwT3IlMkMlMjBpZiUyMHlvdSUyMGFyZSUyMHVzaW5nJTIwYSUyMG1pZGklMjBjb250cm9sbGVyJTIwYW5kJTIwbm90JTIwYSUyMGtleWJvYXJkJTNBJTBBJTJGJTJGJTIwVXNlJTIwYSUyMGNvbnRyb2wlMjBjaGFuZ2UlMjB2YWx1ZSUyMHRvJTIwY29udHJvbCUyMHRoZSUyMHJlZCUyMGFtb3VudC4lMEElMEElMEFzaGFwZSg0JTJDJTIwY2MoMCkpLm91dCgp)
