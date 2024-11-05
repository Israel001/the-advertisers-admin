import React, { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

type ModalProps = {
  text: string;
  children: ReactNode;
  sm?: boolean;
  isOpen?: boolean;
  onCloseModal?: any;
  responsiveStyle?: 'tray' | 'centred';
  noBorderRadius?: boolean;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

const Modal = (props: ModalProps) => {
  const getWidthClass = () => {
    switch (props.width) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'w-[70vw]';
      case 'full':
        return 'w-full';
      default:
        return 'w-full';
    }
  };

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 rounded-lg"
        onClose={props.onCloseModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="flex items-center justify-center overflow-y-auto fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full rounded-none">
          <div
            className={`flex justify-center ${
              props.responsiveStyle === 'tray' ? 'items-end ' : 'items-center'
            } md:items-center md:justify-center min-h-screen text-center rounded-sm`}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`transform overflow-hidden ${getWidthClass()} ${
                  props.responsiveStyle === 'tray'
                    ? 'rounded-t-3xl md:rounded-xl '
                    : props.noBorderRadius
                    ? 'rounded-none'
                    : 'rounded-xl'
                } bg-white text-left align-middle shadow-xl transition-all`}
              >
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {props.text}
                </Dialog.Title>
                <div>{props.children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export { Modal };
