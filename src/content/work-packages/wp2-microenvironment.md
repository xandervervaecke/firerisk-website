---
number: 2
title: Integration of microenvironmental data in fire weather indices
short_title: Microenvironment
phase: before
theme: Wildfire danger · fuel and microclimate
lead: KU Leuven
partners: [INBO, PXL]
image: /images/research/fieldwork.webp
summary: >-
  Near-real-time, high-resolution (30 m) information on fuel load, live fuel
  moisture and microclimate across Flanders, combining UAV, airborne and
  satellite remote sensing.
related: [WP3, WP4, WP6]
contributions:
  KU Leuven: Microclimate modelling, UAV multispectral sensing and CNNs
  INBO: Satellite remote sensing
  PXL: Fuel characteristics and UAV-LiDAR
deliverables:
  - id: D2.1–D2.3
    title: Workflows for near-real-time forecasting of fire weather indices and fuel load / moisture content
  - id: D2.4–D2.6
    title: High-resolution geodatasets for Flanders and corresponding scientific manuscripts
---

## Goals

Weather forecasts rely on synoptic weather stations that measure conditions two metres above short grassland, in a shaded box. That standard setup deliberately minimises the influence of terrain and vegetation. Yet vegetation structure and surface conditions strongly shape local temperature and humidity, both critical for accurate fire modelling. In open ecosystems, air temperatures can exceed forecast values by as much as 30 °C on hot, sunny days.

WP2 develops and tests a spatiotemporal method that integrates remote sensing from multiple platforms (UAV, airborne and satellite) to deliver near-real-time, high-resolution (30 m) information on microenvironmental conditions, including microclimate and fuel characteristics. These data feed fire propagation modelling (WP4) and land management strategies (WP3).

## Tasks

### Task 2.1: Fuel load

Building on high-resolution fuel load maps for the province of Limburg from the BELSPO FuelFusion project (airborne and UAV LiDAR combined with plot inventories), a convolutional neural network (CNN) will be trained with, among others, Sentinel-1 and Sentinel-2 imagery to upscale fuel load estimates to the whole of Flanders. Unlike point-based models, CNNs take the surrounding spatial context into account, and they enable near-real-time, region-wide predictions.

### Task 2.2: Live fuel moisture content

Live fuel moisture content (LFMC) will be measured in 100 plots across 10 study regions, focusing on flammable vegetation types: grassland, heathland and coniferous forest. Field measurements during the fire season are complemented with existing data, including the Globe-LFMC 2.0 database. A random forest model with Sentinel-1 C-band SAR as primary predictor will predict plot-level LFMC, alongside an approach that uses the pretrained multimodal Galileo model to overcome the small sample size.

### Task 2.3: Microclimate temperature and relative humidity

One hundred microclimate loggers will record temperature and relative humidity every 15 minutes across the 10 study regions, yielding roughly 8.5 million measurements over 2.5 years. UAV LiDAR and multispectral flights provide high-resolution predictors such as canopy cover, terrain models and NDVI. A CNN will predict microclimate across the study areas, scaled up to the regional level with satellite, topographic, soil and weather data, enabling near-real-time regional estimates of microclimate and derived fire weather indices such as FWI and HDWI.
