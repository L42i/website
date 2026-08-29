---
order: 5
bib: zerr
bibPosition: drawer      # plain | collapse | drawer
img: /assets/projects/zerr/zerr_patch.png
description: Experimental signal-driven spatialization in Pure Data and Max/MSP.
---

# Zerr~



## Autogenous Spatialization



## The Plugins

Zerr~ is a set of externals for **autogenous spatialization**, a channel-based
approach that distributes a mono signal across arbitrary loudspeaker setups
using the signal's own properties as the control source. Audio features are
extracted in real time and mapped to the geometry of the speaker array, so the
sound decides where it goes. The name comes from the German
*Zerräumlichung* — roughly, spatial disintegration.

 ![alt text](/assets/projects/zerr/zerr_patch.png)

Both packages are fully functional. The Pure Data externals came first and
remain the more open environment for exploration; the Max externals use the
`mc.` multichannel objects and currently give the smoother patching
experience.

**Pure Data:** `zerr_features~`, `zerr_envelopes~`, `zerr_disperser~`,
`zerr_combinator~`

**Max:** `mc.zerr.envelopes~`, `mc.zerr.combinator~`, `mc.zerr.disperser~`,
`mc.zerr.features~`, `zerr.features~`
 

## Performances

The approach was first used as a JACK client during the *QuarantineSessions*,
with a virtual eight-channel setup rendered to binaural Ambisonics, and later
tested in the studio on a 21-loudspeaker dome. An improvised study built
entirely in Pure Data — modular synth patches routed through a send bus into
several Zerr~ spatialization units — was premiered at PdMaxCon25 in
Urbana-Champaign.

Zerr~ works best with simple synthetic material: filtered noise, basic
waveforms, modulated sines. These have a direct connection to the extracted
features, which keeps the control legible, while recorded sound tends to
produce less rewarding artifacts.

Developed by [Zeyu Yang](https://github.com/ringbuffer-org) and
[Henrik von Coler](/people/henrik-von-coler).
