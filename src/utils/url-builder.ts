import {BlendModes, type BoxCropParams, type DebugParams, DefaultOverlayParams, type ImageParams} from "@/types/params";
import signHMAC256 from "@/utils/sign";
import base64 from "@/utils/base-64";

export default function buildUrl(host:string, accessKey:string|null, secret:string, imageKey:string, imageParams:ImageParams, debugParams:DebugParams|null = null, preset:boolean = false) {
	let encodedKey = base64('/'+imageKey, true);
	let newUrl = accessKey ? `/${accessKey}/${encodedKey}` : `/${encodedKey}`;

	const compressParams = (params: { [key:string]: any }, defaultParams:{ [key:string]: any }, toSkip:string[] = []) => {
		if (params === null) {
			return null;
		}

		const newParams:{ [key:string]: any } = {};
		for(const key of Object.keys(params)) {
			if (toSkip.includes(key)) {
				continue;
			}

			if (typeof params[key] === 'object' && params[key] && defaultParams[key] !== undefined) {
				const obj = compressParams(params[key], defaultParams[key]);
				if (obj && Object.keys(obj).length > 0) {
					newParams[key] = obj;
				}
			} else if (params[key] !== undefined && params[key] !== defaultParams[key]) {
				console.log('compressParams', key, params[key], defaultParams[key]);
				newParams[key] = params[key];
			}
		}

		console.log('compressParams', params);
		console.log('compressParams', newParams);
		return newParams;
	}

	const processBoxParams = (noun:string, params:BoxCropParams) => {
		if (params.padding != 8) {
			newUrl += `/${noun}:pad:${params.padding}`;
		}

		if (params.index > -1) {
			newUrl += `/${noun}:index:${params.index}`;
		} else if (params.index < -1) {
			if (params.index === -2) {
				newUrl += `/${noun}:index:largest`;
			} else {
				newUrl += `/${noun}:index:smallest`;
			}
		}

		if (params.zoom > 0) {
			newUrl += `/${noun}:zoom:${params.zoom}`;
		}

		if (params.vGravity !== 'top' || params.hGravity !== 'center') {
			newUrl += `/${noun}:gravity:${params.hGravity}:${params.vGravity}`;
		}

		if (params.focus) {
			newUrl += `/${noun}:focus`;
		}
	}

	//region Background Removal
	if (imageParams.enabledBackgroundRemoval) {
		if (imageParams.backgroundRemoval.imageKey) {
			newUrl += `/bgr:img:${imageParams.backgroundRemoval.mode}:${base64(imageParams.backgroundRemoval.imageKey, true)}`;
		} else if (imageParams.backgroundRemoval.backgroundColor) {
			newUrl += `/bgr:c:${imageParams.backgroundRemoval.mode}:${imageParams.backgroundRemoval.backgroundColor}`;
		}
	}

	//region Source Crop Params
	console.log(imageParams.sourceCrop);
	if (imageParams.enableSourceCrop && imageParams.sourceCrop.width > 0 && imageParams.sourceCrop.height > 0) {
		newUrl += `/src:${imageParams.sourceCrop.x}:${imageParams.sourceCrop.y}:${imageParams.sourceCrop.width}:${imageParams.sourceCrop.height}`;
	}

	//region Crop Params
	if (imageParams.width > 0) {
		newUrl += `/w:${imageParams.width}`;
	}

	if (imageParams.enableCrop) {
		if (imageParams.crop.length > 0) {
			newUrl += `/crop:${imageParams.crop.join(':')}`;
		}

		if (imageParams.height > 0) {
			newUrl += `/h:${imageParams.height}`;
		}

		if (imageParams.crop.includes('smart') && imageParams.smartMode) {
			newUrl += `/smart:${imageParams.smartMode}`;
		}

		if (imageParams.aspectRatioWidth > 0 && imageParams.aspectRatioHeight > 0) {
			newUrl += `/ar:${imageParams.aspectRatioWidth}:${imageParams.aspectRatioHeight}`;
		}

		if (imageParams.zoom > 1) {
			newUrl += `/zoom:${imageParams.zoom}`;
		}

		if (imageParams.padding.left > 0 || imageParams.padding.top > 0 || imageParams.padding.right > 0 || imageParams.padding.bottom > 0) {
			if (imageParams.padding.left === imageParams.padding.top && imageParams.padding.top === imageParams.padding.right && imageParams.padding.right == imageParams.padding.bottom) {
				newUrl += `/pad:${imageParams.padding.color ?? '00000000'}:${imageParams.padding.left}`;
			} else if (imageParams.padding.left === imageParams.padding.right && imageParams.padding.top == imageParams.padding.bottom) {
				newUrl += `/pad:${imageParams.padding.color}:${imageParams.padding.left}:${imageParams.padding.top}`;
			} else {
				newUrl += `/pad:${imageParams.padding.color}:${imageParams.padding.left}:${imageParams.padding.top}:${imageParams.padding.right}:${imageParams.padding.bottom}`;
			}
		}

		if (imageParams.border.left > 0 || imageParams.border.top > 0 || imageParams.border.right > 0 || imageParams.border.bottom > 0) {
			if (imageParams.border.left === imageParams.border.top && imageParams.border.top === imageParams.border.right && imageParams.border.right == imageParams.border.bottom) {
				newUrl += `/border:${imageParams.border.color ?? '00000000'}:${imageParams.border.left}`;
			} else if (imageParams.border.left === imageParams.border.right && imageParams.border.top == imageParams.border.bottom) {
				newUrl += `/border:${imageParams.border.color}:${imageParams.border.left}:${imageParams.border.top}`;
			} else {
				newUrl += `/border:${imageParams.border.color}:${imageParams.border.left}:${imageParams.border.top}:${imageParams.border.right}:${imageParams.border.bottom}`;
			}
		}

		if (imageParams.hGravity || imageParams.vGravity) {
			const hg = imageParams.hGravity ?? 'center';
			const vg = imageParams.vGravity ?? 'center';

			let gravity = `${hg}:${vg}`;
			gravity = gravity === 'center:center' ? 'center' : gravity;

			if (gravity !== 'center') {
				newUrl += `/gravity:${gravity}`;
			}
		}

		if (imageParams.crop.includes('face')) {
			processBoxParams('face', imageParams.face);
		}

		if (imageParams.crop.includes('person')) {
			processBoxParams('person', imageParams.person);
		}

		if (imageParams.crop.includes('focus')) {
			const fpx = imageParams.focalPoint.x.toFixed(4);
			const fpy = imageParams.focalPoint.y.toFixed(4);
			newUrl += `/fp:${fpx}:${fpy}`;

			if (imageParams.focalPointZoom > 0) {
				newUrl += `/fp:zoom:${imageParams.focalPointZoom}`;
			}
		}
	}


	if (imageParams.enableRedact) {
		if (imageParams.redact.faces.length > 0 || imageParams.redact.people.length > 0 || imageParams.redact.regions.length > 0) {
			if (imageParams.redact.faces.length > 0) {
				newUrl += `/redact:faces:${imageParams.redact.faces.join(',')}`;
			}

			if (imageParams.redact.people.length > 0) {
				newUrl += `/redact:people:${imageParams.redact.people.join(',')}`;
			}

			if (imageParams.redact.regions.length > 0) {
				for(const region of imageParams.redact.regions) {
					if (region.width > 0 && region.height > 0) {
						newUrl += `/redact:region:${region.cornerRadius ?? 0}:${region.rotation ?? 0}:${region.left},${region.top},${region.width},${region.height}`;
					}
				}
			}

			if (imageParams.redact.blur > 0) {
				newUrl += `/redact:blur:${imageParams.redact.blur}`;
			}

			if (imageParams.redact.useColor) {
				newUrl += `/redact:color:${imageParams.redact.color}`;
			}

			if (imageParams.redact.pixelate > 0) {
				newUrl += `/redact:pixelate:${imageParams.redact.pixelate}`;
			}

			if (imageParams.redact.expandMask > 0) {
				newUrl += `/redact:mask:expand:${imageParams.redact.expandMask}`;
			}

			if (imageParams.redact.blurMask > 0) {
				newUrl += `/redact:mask:blur:${imageParams.redact.blurMask}`;
			}

			if (imageParams.redact.pixelateMask > 0) {
				newUrl += `/redact:mask:pixelate:${imageParams.redact.pixelateMask}`;
			}
		}
	}
	//endregion

	//region Mask Params
	if (imageParams.enableMask) {
		if (imageParams.mask.type === 'image' && imageParams.mask.imageKey) {
			newUrl += `/mask:image:${base64(imageParams.mask.imageKey, true)}:${imageParams.mask.fit}`;
		} else if (imageParams.mask.type === 'rect') {
			newUrl += `/mask:rect:${imageParams.mask.cornerRadius}`;
		} else if (imageParams.mask.type === 'square') {
			newUrl += `/mask:square:${imageParams.mask.cornerRadius}`;
		} else {
			newUrl += `/mask:${imageParams.mask.type}`;
		}
	}


	//region Image Attributes
	if (imageParams.backgroundColor) {
		newUrl += `/bg:${imageParams.backgroundColor}`;
	}

	//endregion

	//region Stylize
	if (imageParams.enableStylize) {
		let hasStyle = false;
		if (imageParams.stylize.blur > 0) {
			hasStyle = true;
			newUrl += `/blur:${imageParams.stylize.blur}`;
		}

		if (imageParams.stylize.pixelate > 0) {
			hasStyle = true;
			newUrl += `/px:${imageParams.stylize.pixelate}`;
		}

		if (hasStyle) {
			newUrl += `/stylize:order:${imageParams.stylize.order.join(',')}`;
		}
	}

	//endregion

	//region Rotation
	if (imageParams.enabledRotation && imageParams.rotation.rotation !== 0) {
		newUrl += `/rot:${imageParams.rotation.rotation}`;
		if (imageParams.rotation.mode !== 'none') {
			newUrl += `:${imageParams.rotation.mode}`;
		}
	}

	//region Adjustments
	if (imageParams.enableAdjustments) {
		if (imageParams.adjustments.brightness !== 100) {
			newUrl += `/bri:${imageParams.adjustments.brightness}`;
		}

		if (imageParams.adjustments.saturation !== 100) {
			newUrl += `/sat:${imageParams.adjustments.saturation}`;
		}

		if (imageParams.adjustments.hue !== 0) {
			newUrl += `/hue:${imageParams.adjustments.hue}`;
		}

		if (imageParams.adjustments.contrast !== 1) {
			newUrl += `/con:${imageParams.adjustments.contrast}`;
		}

		if (imageParams.adjustments.exposure !== 0) {
			newUrl += `/exp:${imageParams.adjustments.exposure}`;
		}

		if (imageParams.adjustments.gamma !== 1) {
			newUrl += `/gamma:${imageParams.adjustments.gamma}`;
		}

		if (imageParams.adjustments.vibrance > 0) {
			newUrl += `/vib:${imageParams.adjustments.vibrance}`;
		}

		if (imageParams.adjustments.texture > 0) {
			newUrl += `/texture:${imageParams.adjustments.texture}`;
			if (imageParams.adjustments.textureDensity < 100) {
				newUrl += `:${imageParams.adjustments.textureDensity}`;
			}
		}

		if (imageParams.adjustments.invert) {
			newUrl += "/invert:true"
		}
	}

	//endregion

	//region Gradient Map
	if (imageParams.enableGradientMap && imageParams.gradientMap.opacity > 0) {
		if (!imageParams.gradientMap.monochrome) {
			newUrl += "/gm:mono:false";
		}

		if (imageParams.gradientMap.blur > 0) {
			newUrl += `/gm:blur:${imageParams.gradientMap.blur}`;
		}

		if (imageParams.gradientMap.blendMode !== BlendModes.BlendModeOver) {
			newUrl += `/gm:blend:${imageParams.gradientMap.blendMode}`;
		}

		newUrl += `/gm:opacity:${imageParams.gradientMap.opacity}`;

		newUrl += "/gm:stops";
		for(const stop of imageParams.gradientMap.stops) {
			if (stop.enabled) {
				newUrl += `:${Math.floor(stop.stop).toFixed(0)},${stop.color.replaceAll('#', '')}`;
			}
		}
	}

	//endregion


	//region Debug Params
	const debug:string[] = [];

	if (debugParams) {
		if (debugParams.faces) {
			debug.push('faces');
		}

		if (debugParams.allFaces) {
			debug.push('all-faces');
		}

		if (debugParams.people) {
			debug.push('people');
		}

		if (debugParams.allPeople) {
			debug.push('all-people');
		}

		if (debugParams.otherLabels) {
			debug.push('other-labels');
		}

		if (debug.length > 0) {
			newUrl += `/debug:${debug.join(':')}`;
		}

		const nocache:string[] = [];

		if (debugParams.disableSourceCache) {
			nocache.push('source');
		}

		if (debugParams.disableMetaCache) {
			nocache.push('meta');
		}

		if (debugParams.disableRenderCache) {
			nocache.push('render');
		}

		if (nocache.length > 0) {
			newUrl += `/nocache:${nocache.join(':')}`;
		}
	}

	//endregion

	//region Overlays
	if (imageParams.overlays.length > 0) {
		if (imageParams.encodeOverlays) {
			const overlays:any[] = [];
			for(const overlay of imageParams.overlays) {
				if (!overlay.enabled) {
					continue;
				}

				overlays.push(compressParams(overlay, DefaultOverlayParams, ['id']));
			}

			if (overlays.length > 0) {
				newUrl += `/ovs:${base64(JSON.stringify(overlays), true)}`;
			}
		} else {
			let actualIndex = 0;
			for(const overlay of imageParams.overlays) {
				if (!overlay.enabled) {
					continue;
				}

				if (overlay.url && overlay.url.trim().length > 0) {
					newUrl += `/ov:${actualIndex}:url:${base64(overlay.url, true)}`;
				}

				if (overlay.text && overlay.text.trim().length > 0) {
					newUrl += `/ov:${actualIndex}:text:${base64(overlay.text, true)}`;
				}

				if (overlay.type === 'image') {
					if (overlay.trim) {
						newUrl += `/ov:${actualIndex}:trim`;
					}

					if (overlay.substitutions.length > 0) {
						for(const substitution of overlay.substitutions) {
							newUrl += `/ov:${actualIndex}:sub:${base64(substitution.key, true)}:${base64(substitution.value, true)}`;
						}
					}
				}

				if (overlay.font && overlay.font.trim().length > 0) {
					newUrl += `/ov:${actualIndex}:font:${base64(overlay.font, true)}`;
				}

				const coordType = overlay.relativeCoords ? 'rel' : 'px';

				if (overlay.hPadding > 0 || overlay.vPadding > 0) {
					newUrl += `/ov:${actualIndex}:pad:${overlay.hPadding}:${overlay.vPadding}`;
				}

				if (overlay.x > 0 || overlay.y > 0) {
					newUrl += `/ov:${actualIndex}:xy:${coordType}:${overlay.x}:${overlay.y}`;
				}

				if (overlay.hAnchor !== 'right' || overlay.vAnchor !== 'bottom') {
					newUrl += `/ov:${actualIndex}:a:${overlay.hAnchor}:${overlay.vAnchor}`;
				}

				const sizeType = overlay.relativeSize ? 'rel' : 'px';

				if (overlay.width > 0 || overlay.height > 0) {
					newUrl += `/ov:${actualIndex}:sz:${sizeType}:${overlay.width}:${overlay.height}`;
				}

				if (overlay.minWidth > 0 || overlay.minHeight > 0) {
					newUrl += `/ov:${actualIndex}:minsz:${overlay.minWidth}:${overlay.minHeight}`;
				}

				if (overlay.maxWidth > 0 || overlay.maxHeight > 0) {
					newUrl += `/ov:${actualIndex}:maxsz:${overlay.maxWidth}:${overlay.maxHeight}`;
				}

				if (overlay.opacity !== 100) {
					newUrl += `/ov:${actualIndex}:o:${overlay.opacity}`;
				}

				if (overlay.rotate !== 0) {
					newUrl += `/ov:${actualIndex}:rot:${overlay.rotate}`;
				}

				if (overlay.type === 'image' && overlay.fit !== 'fit') {
					newUrl += `/ov:${actualIndex}:fit:${overlay.fit}`;
				}

				if (overlay.type === 'text' && overlay.textColor !== '#000000') {
					newUrl += `/ov:${actualIndex}:tc:${overlay.textColor}`;
				}

				if (overlay.dropShadow.enabled) {
					if (overlay.dropShadow.opacity !== 100) {
						newUrl += `/ov:${actualIndex}:ds:o:${overlay.dropShadow.opacity}`;
					}
					if (overlay.dropShadow.blur > 0) {
						newUrl += `/ov:${actualIndex}:ds:bl:${overlay.dropShadow.blur}`;
					}
					newUrl += `/ov:${actualIndex}:ds:c:${overlay.dropShadow.color.replaceAll('#', '')}`;
					if (overlay.dropShadow.offsetX > 0 || overlay.dropShadow.offsetY > 0) {
						newUrl += `/ov:${actualIndex}:ds:xy:${overlay.dropShadow.offsetX}:${overlay.dropShadow.offsetY}`;
					}
				}

				if (overlay.background.enabled) {
					if (overlay.background.backgroundColorType !== 'color' || (overlay.background.backgroundColorType === 'color' && overlay.background.backgroundColor !== '#00000000')) {
						if (overlay.background.backgroundColorType === 'color') {
							newUrl += `/ov:${actualIndex}:bg:c:${overlay.background.backgroundColor.replaceAll('#', '')}`;
						} else {
							newUrl += `/ov:${actualIndex}:bg:c:${overlay.background.backgroundColorType}:${overlay.background.dominantColorOpacity}:${overlay.background.backgroundColor.replaceAll('#', '')}`;
						}
					}

					if (overlay.background.blur > 0) {
						newUrl += `/ov:${actualIndex}:bg:bl:${overlay.background.blur}`;
					}

					if (overlay.background.saturation !== 100) {
						newUrl += `/ov:${actualIndex}:bg:sat:${overlay.background.saturation}`;
					}

					if (overlay.background.contrast !== 100) {
						newUrl += `/ov:${actualIndex}:bg:con:${overlay.background.contrast}`;
					}

					if (overlay.background.brightness !== 100) {
						newUrl += `/ov:${actualIndex}:bg:bri:${overlay.background.brightness}`;
					}

					if (overlay.background.cornerRadius > 0) {
						newUrl += `/ov:${actualIndex}:bg:br:${overlay.background.cornerRadius}`;
					}

					const sizeType = overlay.background.relativeSize ? 'rel' : 'px';

					if (overlay.background.width > 0 || overlay.background.height > 0) {
						newUrl += `/ov:${actualIndex}:bg:sz:${sizeType}:${overlay.background.width}:${overlay.background.height}`;
					}

					if (overlay.background.minWidth > 0 || overlay.background.minHeight > 0) {
						newUrl += `/ov:${actualIndex}:bg:minsz:${overlay.background.minWidth}:${overlay.background.minHeight}`;
					}

					if (overlay.background.maxWidth > 0 || overlay.background.maxHeight > 0) {
						newUrl += `/ov:${actualIndex}:bg:maxsz:${overlay.background.maxWidth}:${overlay.background.maxHeight}`;
					}

					if (overlay.background.hAlign !== 'center' || overlay.background.vAlign !== 'center') {
						newUrl += `/ov:${actualIndex}:bg:align:${overlay.background.hAlign}:${overlay.background.vAlign}`;
					}

					const paddingType = overlay.background.relativePadding ? 'rel' : 'px';
					if (overlay.background.hPadding > 0 || overlay.background.vPadding > 0) {
						newUrl += `/ov:${actualIndex}:bg:pad:${paddingType}:${overlay.background.hPadding}:${overlay.background.vPadding}`;
					}
				}

				actualIndex++;
			}
		}
	}

	//endregion

	//region Export
	if (imageParams.export.format !== 'webp') {
		newUrl += `/fmt:${imageParams.export.format}`;
	}

	if (imageParams.export.quality !== 85) {
		newUrl += `/q:${imageParams.export.quality}`;
	}

	if (imageParams.export.format === 'webp' && imageParams.export.reductionEffort !== 4) {
		newUrl += `/reduction:${imageParams.export.reductionEffort}`;
	}

	if (imageParams.export.lossless) {
		newUrl += `/lossless:1`;
	}

	if (imageParams.export.nearLossless) {
		newUrl += `/nloss:1`;
	}

	//endregion


	return host + newUrl + `?_=${new Date().getTime()}&s=`+signHMAC256(secret, newUrl)+(preset ? '&preset': '');
}