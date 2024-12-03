declare module "react-rating-stars-component" {
  import { Component } from "react";

  interface ReactStarsProps {
    count: number;
    onChange?: (newRating: number) => void;
    size?: number;
    isHalf?: boolean;
    value?: number;
    edit?: boolean;
    emptyIcon?: React.ReactNode;
    halfIcon?: React.ReactNode;
    filledIcon?: React.ReactNode;
    color?: string;
    activeColor?: string;
  }

  export default class ReactStars extends Component<ReactStarsProps> {}
}
