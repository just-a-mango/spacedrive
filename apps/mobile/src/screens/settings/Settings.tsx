import {
	Books,
	FlyingSaucer,
	GearSix,
	HardDrive,
	Heart,
	Icon,
	Key,
	PaintBrush,
	PuzzlePiece,
	ShareNetwork,
	ShieldCheck,
	TagSimple
} from 'phosphor-react-native';
import React from 'react';
import { SectionList, Text, View } from 'react-native';
import { SettingsItem, SettingsItemDivider } from '~/components/settings/SettingsItem';
import { tw, twStyle } from '~/lib/tailwind';
import { SettingsStackParamList, SettingsStackScreenProps } from '~/navigation/SettingsNavigator';

type SectionType = {
	title: string;
	data: {
		title: string;
		icon: Icon;
		navigateTo: keyof SettingsStackParamList;
	}[];
};

const sections: SectionType[] = [
	{
		title: 'Client',
		data: [
			{
				icon: GearSix,
				navigateTo: 'GeneralSettings',
				title: 'General'
			},
			{
				icon: Books,
				navigateTo: 'LibrarySettings',
				title: 'Libraries'
			},
			{
				icon: PaintBrush,
				navigateTo: 'AppearanceSettings',
				title: 'Appearance'
			},
			{
				icon: ShieldCheck,
				navigateTo: 'PrivacySettings',
				title: 'Privacy'
			},
			{
				icon: PuzzlePiece,
				navigateTo: 'ExtensionsSettings',
				title: 'Extensions'
			}
		]
	},
	{
		title: 'Library',
		data: [
			{
				icon: GearSix,
				navigateTo: 'LibraryGeneralSettings',
				title: 'General'
			},
			{
				icon: HardDrive,
				navigateTo: 'LocationSettings',
				title: 'Locations'
			},
			{
				icon: ShareNetwork,
				navigateTo: 'NodesSettings',
				title: 'Nodes'
			},
			{
				icon: TagSimple,
				navigateTo: 'TagsSettings',
				title: 'Tags'
			},
			{
				icon: Key,
				navigateTo: 'KeysSettings',
				title: 'Keys'
			}
		]
	},
	{
		title: 'Resources',
		data: [
			{
				icon: FlyingSaucer,
				navigateTo: 'About',
				title: 'About'
			},
			{
				icon: Heart,
				navigateTo: 'Support',
				title: 'Support'
			}
		]
	}
];

function renderSectionHeader({ section }: { section: { title: string } }) {
	return (
		<Text
			style={twStyle(
				'mb-2 ml-2 text-sm font-bold text-ink',
				section.title === 'Client' ? 'mt-2' : 'mt-5'
			)}
		>
			{section.title}
		</Text>
	);
}

export default function SettingsScreen({ navigation }: SettingsStackScreenProps<'Home'>) {
	return (
		<View style={tw`flex-1`}>
			<SectionList
				sections={sections}
				contentContainerStyle={tw`py-4`}
				ItemSeparatorComponent={SettingsItemDivider}
				renderItem={({ item }) => (
					<SettingsItem
						title={item.title}
						leftIcon={item.icon}
						onPress={() => navigation.navigate(item.navigateTo as any)}
					/>
				)}
				renderSectionHeader={renderSectionHeader}
				ListFooterComponent={
					<View style={tw`mt-6 mb-4 items-center`}>
						<Text style={tw`text-base font-bold text-ink`}>Spacedrive</Text>
						{/* TODO: Get this automatically (expo-device have this?) */}
						<Text style={tw`mt-0.5 text-xs font-medium text-ink-faint`}>v0.1.0</Text>
					</View>
				}
				showsVerticalScrollIndicator={false}
				stickySectionHeadersEnabled={false}
				initialNumToRender={50}
			/>
		</View>
	);
}
