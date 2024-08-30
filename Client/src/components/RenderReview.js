import React from 'react';
import avt from '../assets/avtDefault.avif';
import moment from 'moment';
import { renderStar } from "../ultils/helper";

const RenderReview = ({ image = avt, name = 'Anonymous', star, comment, createdAt }) => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center">
        <div className="p-2 flex-none">
          <img
            src={image}
            alt="avatar"
            className="w-[60px] h-[60px] object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col flex-auto ml-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{name}</h3>
            <span className="text-sm text-gray-500">
              {moment(createdAt).fromNow()}
            </span>
          </div>
          <div className="flex items-center mt-1">
            <span className="flex items-center gap-1 text-main">
              {renderStar(star)?.map((el, i) => (
                <span key={i}>{el}</span>
              ))}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-gray-700">{comment}</p>
    </div>
  );
};

export default RenderReview;
