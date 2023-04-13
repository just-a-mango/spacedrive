import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ExplorerData, rspc, useLibraryContext } from '@sd/client';
import { getExplorerStore, useExplorerStore } from '~/hooks/useExplorerStore';
import { Inspector } from '../Explorer/Inspector';
import ExplorerContextMenu from './ContextMenu';
import TopBar from './TopBar';
import View from './View';

interface Props {
	data?: ExplorerData;
}

export default function Explorer(props: Props) {
	const expStore = useExplorerStore();
	const { library } = useLibraryContext();
	const locationId = useParams().id as string;

	const [separateTopBar, setSeparateTopBar] = useState<boolean>(false);

	rspc.useSubscription(['jobs.newThumbnail', { library_id: library!.uuid, arg: null }], {
		onData: (cas_id) => {
			expStore.addNewThumbnail(cas_id);
		}
	});

	const onScroll = useCallback((scrolled: boolean) => {
		setSeparateTopBar(scrolled);
	}, []);

	useEffect(() => {
		getExplorerStore().selectedRowIndex = -1;
	}, [locationId]);

	return (
		<div className="flex h-screen w-full flex-col bg-app">
			<TopBar showSeparator={separateTopBar} />

			<div className="flex flex-1">
				<ExplorerContextMenu>
					<div className="flex-1 overflow-hidden">
						{props.data && <View data={props.data.items} onScroll={onScroll} />}
					</div>
				</ExplorerContextMenu>

				{expStore.showInspector && props.data?.items[expStore.selectedRowIndex] && (
					<div className="w-[260px] shrink-0">
						<Inspector data={props.data?.items[expStore.selectedRowIndex]} onScroll={onScroll} />
					</div>
				)}
			</div>
		</div>
	);
}
