import classNames from 'classnames';
import * as React from 'react';


import { useBootstrapPrefix } from './utils';
import { BsPrefixOnlyProps } from './helpers';

export interface ImageProps
  extends BsPrefixOnlyProps,
    React.ImgHTMLAttributes<HTMLImageElement> {
  fluid?: boolean;
  rounded?: boolean;
  roundedCircle?: boolean;
  thumbnail?: boolean;
}

export const propTypes = {
  /**
   * @default 'img'
   */
  bsPrefix: string,
  
  fluid: bool,

  
  rounded: bool,

  
  roundedCircle: bool,

  
  thumbnail: bool,
};

const defaultProps = {
  fluid: false,
  rounded: false,
  roundedCircle: false,
  thumbnail: false,
};

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    { bsPrefix, className, fluid, rounded, roundedCircle, thumbnail, ...props },
    ref,
  ) => {
    bsPrefix = useBootstrapPrefix(bsPrefix, 'img');
    return (
      <img // eslint-disable-line jsx-a11y/alt-text
        ref={ref}
        {...props}
        className={classNames(
          className,
          fluid && `${bsPrefix}-fluid`,
          rounded && `rounded`,
          roundedCircle && `rounded-circle`,
          thumbnail && `${bsPrefix}-thumbnail`,
        )}
      />
    );
  },
);

Image.displayName = 'Image';
Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export Image;


import createWithBsPrefix from './createWithBsPrefix';
import FigureImage from './FigureImage';
import FigureCaption from './FigureCaption';

const Figure = createWithBsPrefix('figure', {
  Component: 'figure',
});

export Object.assign(Figure, {
  Image: FigureImage,
  Caption: FigureCaption,
});


import classNames from 'classnames';
import * as React from 'react';

import Image, { ImageProps, propTypes as imagePropTypes } from './images';

const defaultProps = { fluid: true };

const FigureImage = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, ...props }, ref) => (
    <Image
      ref={ref}
      {...props}
      className={classNames(className, 'figure-img')}
    />
  ),
);

FigureImage.displayName = 'FigureImage';
FigureImage.propTypes = imagePropTypes;
FigureImage.defaultProps = defaultProps;

export FigureImage;


import createWithBsPrefix from './createWithBsPrefix';

const FigureCaption = createWithBsPrefix('figure-caption', {
  Component: 'figcaption',
});

export FigureCaption;
