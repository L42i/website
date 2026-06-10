---
title: 3DBox
---

<div class="md-carousel">
    <div class="md-carousel-track">
        <img src="/assets/projects/3dbox/old_rich_speaker_setup.png" alt="Setup 1" />
        <img src="/assets/projects/3dbox/rich_speaker_setup.png" alt="Setup 2" />
    </div>
</div>

The 3DBox is our first version of a spatial sound system for research and creative practice. Our main objective is to provide a space that can be used across all disciplines.

## Setup and Hardware

The 3DBox sound system consists of 28 Neumann KH120 MKII loudspeakers, mounted on aluminum trusses.
 

- Dimensions: 4.7 x 5.2 x 3.7 meters
- AES67 ready speakers, combined with a DANTE network.

## Rendering Software

Our system can be used with different rendering solutions. Some of them in a more conventional workflow, others more experimental.

### Ambisonics Solution

The rendering software runs on a Linux computer with a Klark Teknik DN9630 audio interface. A Jack server is started with a sample rate of 48 000 Hz and a buffer size of 64 samples, resulting in an audio output latency of 1.33 ms.

A custom Ambisonics encoding system5 is implemented, based on SC-HOA, a Higher-Order Ambisonics extension for SuperCollider. This system utilizes fifth-order Ambisonics to generate four virtual sound sources, which are controlled through spherical coordinates received via OSC messages.

### Experimental Panning System

Graduate student [Xinni Li](https://l42i.music.gatech.edu/people/xinni-li) is currently working on a custom implementation of an experimental VBAP based algorithm.

## Construction

The whole system has been built by students from our team and the School of Music.

<center>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/Sc1QSskVY5E?si=aqBGX4miQ80HUymv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</center>
